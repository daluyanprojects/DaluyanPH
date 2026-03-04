import unittest
import types
import sys
import importlib
import datetime as _dt
from unittest.mock import patch


class CleanupCommandTest(unittest.TestCase):
    def test_cleanup_expired_scenarios_handles_orphans_and_files(self):
        # Prepare fake django modules before importing the command
        # Stub django.core.management.base.BaseCommand
        core_mgmt_base = types.ModuleType("django.core.management.base")

        class BaseCommandStub:
            pass

        core_mgmt_base.BaseCommand = BaseCommandStub
        sys.modules["django.core.management.base"] = core_mgmt_base

        # Stub django.utils.timezone.now
        utils_mod = types.ModuleType("django.utils")
        tz = types.SimpleNamespace(now=lambda: _dt.datetime.now())
        utils_mod.timezone = tz
        sys.modules["django.utils"] = utils_mod

        # Stub django.conf.settings with BASE_DIR
        conf_mod = types.ModuleType("django.conf")
        conf_mod.settings = types.SimpleNamespace(BASE_DIR="/tmp")
        sys.modules["django.conf"] = conf_mod

        # Create fake models module api.models.scenario
        mod_name = "api.models.scenario"
        fake_mod = types.ModuleType(mod_name)

        # Helpers to record deletions
        deleted_files = []

        class FakeFile:
            def __init__(self, name):
                self.name = name

            def delete(self):
                deleted_files.append(self.name)

        class FakeFloodScenario:
            def __init__(self, name):
                self.tif_file = FakeFile(name)

        class FloodScenarioManager:
            def __init__(self, items):
                self._items = items

            def all(self):
                return self._items

        class FakeScenarioObj:
            def __init__(self, flood_outputs_list):
                class FO:
                    def __init__(self, items):
                        self._items = items

                    def all(self):
                        return self._items

                self.flood_outputs = FO(flood_outputs_list)

        class ScenarioQuerySet(list):
            def delete(self):
                count = len(self)
                self.clear()
                return (count, {})

        class ScenarioManager:
            def __init__(self, items):
                self._items = items

            def filter(self, **kwargs):
                return ScenarioQuerySet(self._items)

        # Setup fake objects: one scenario with one linked tif 'linked.tif'
        linked = FakeFloodScenario("linked.tif")
        fake_scenario = FakeScenarioObj([linked])

        fake_mod.FloodScenario = types.SimpleNamespace(objects=FloodScenarioManager([linked]))
        fake_mod.Scenario = types.SimpleNamespace(objects=ScenarioManager([fake_scenario]))

        sys.modules[mod_name] = fake_mod

        # Import the management command module (it will use our stubs)
        cmd_mod = importlib.import_module("api.management.commands.cleanup_expired_scenarios")
        cmd = cmd_mod.Command()

        # Provide minimal stdout/style used by the command
        outputs = []
        cmd.stdout = types.SimpleNamespace(write=lambda s: outputs.append(s))
        cmd.style = types.SimpleNamespace(SUCCESS=lambda s: s, WARNING=lambda s: s, ERROR=lambda s: s)

        # Mock filesystem: tif_dir contains 'linked.tif' and 'orphan.tif'
        with patch("os.path.exists", return_value=True), \
             patch("os.listdir", return_value=["linked.tif", "orphan.tif"]), \
             patch("os.remove") as fake_remove:
            # Run handle
            cmd.handle()

        # Verify that the orphan was removed and linked file's delete() was called
        fake_remove.assert_called()
        # 'linked.tif' should have been deleted via FakeFile.delete()
        self.assertIn("linked.tif", deleted_files)

        # Clean up injected modules
        for name in ["django.core.management.base", "django.utils", "django.conf", mod_name]:
            if name in sys.modules:
                del sys.modules[name]


if __name__ == "__main__":
    unittest.main()
