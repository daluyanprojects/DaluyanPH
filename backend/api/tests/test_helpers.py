import unittest
from unittest.mock import patch
import types
import sys

from api.utils import helpers


class DummyArray:
    def __init__(self, data):
        self._data = data
        self.shape = (len(data), len(data[0]) if data else 0)

    def __getitem__(self, key):
        # support data[row, col]
        row, col = key
        return self._data[row][col]


class DummySrc:
    def __init__(self, array, transform=None):
        self._array = array
        self.transform = transform

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self, band):
        return self._array


class DummyFloodScenario:
    def __init__(self, confidence_map):
        self.confidence_map = confidence_map


class HelpersTestCase(unittest.TestCase):
    def test_extract_confidence_from_tif_returns_nonzero_cells(self):
        data = DummyArray([[0, 5], [2, 0]])
        dummy_src = DummySrc(data, transform="dummy-transform")

        def fake_open(path):
            return dummy_src

        # Patch xy to return (lng, lat) based on row/col for deterministic output
        with patch.object(helpers, "xy", side_effect=lambda transform, r, c: (c + 0.1, r + 0.2)):
            with patch.object(helpers.rasterio, "open", side_effect=fake_open):
                result = helpers.extract_confidence_from_tif("/path/to/fake.tif")

        # Expect two entries for non-zero values at (0,1)=5 and (1,0)=2
        expected = [
            {"lat": 0 + 0.2, "lng": 1 + 0.1, "confidence": 5},
            {"lat": 1 + 0.2, "lng": 0 + 0.1, "confidence": 2},
        ]

        # Order may follow row-major iteration
        self.assertCountEqual(result, expected)

    def test_get_confidence_from_db_returns_confidence_map(self):
        expected_map = [{"lat": 1.0, "lng": 2.0, "confidence": 0.9}]
        dummy = DummyFloodScenario(expected_map)

        # Inject a fake api.models module so importing FloodScenario doesn't load Django GIS
        fake_mod = types.ModuleType("api.models")
        fake_mod.FloodScenario = DummyFloodScenario
        sys.modules["api.models"] = fake_mod
        try:
            with patch.object(helpers, "get_object_or_404", return_value=dummy) as fake_get:
                got = helpers.get_confidence_from_db(scenario_id=42)
                fake_get.assert_called_once()
                self.assertEqual(got, expected_map)
        finally:
            del sys.modules["api.models"]

    def test_format_scenario_request_extracts_and_defaults(self):
        class DummyRequest:
            def __init__(self, data):
                self.data = data

        data = {"session_id": "s1", "type": "flood", "rainfall": 120, "agent": "user"}
        req = DummyRequest(data)
        out = helpers.format_scenario_request(req)

        self.assertEqual(out["session_id"], "s1")
        self.assertEqual(out["type"], "flood")
        self.assertEqual(out["rainfall"], 120)
        self.assertFalse(out["is_soil"])
        self.assertFalse(out["is_drainage"])
        self.assertEqual(out["agent"], "user")


if __name__ == "__main__":
    unittest.main()
