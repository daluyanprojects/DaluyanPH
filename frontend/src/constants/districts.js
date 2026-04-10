const manilaRange = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) =>
    `1303901${String(start + i).padStart(3, "0")}`
  );

export const DISTRICT_BARANGAYS = {
  "Binondo":     manilaRange(287, 296),
  "Ermita":      [...manilaRange(659, 661), ...manilaRange(663, 664), ...manilaRange(666, 670), "1303901959", "1303901960", "1303901963", "1303901964"],
  "Intramuros":  manilaRange(654, 658),
  "Malate":      manilaRange(688, 750),
  "Paco":        [...manilaRange(662, 662), ...manilaRange(809, 815), ...manilaRange(671, 687)],
  "Pandacan":    manilaRange(833, 872),
  "Port Area":   manilaRange(649, 653),
  "Quiapo":      [...manilaRange(306, 309), ...manilaRange(383, 394)],
  "Sampaloc":    manilaRange(395, 587),
  "San Andres":  manilaRange(751, 793),
  "San Miguel":  manilaRange(637, 648),
  "San Nicolas": manilaRange(268, 282),
  "Santa Ana":   [...manilaRange(794, 832), ...manilaRange(873, 880)],
  "Santa Cruz":  [...manilaRange(297, 305), ...manilaRange(310, 382)],
  "Santa Mesa":  [...manilaRange(588, 636), "1303901987"],
  "Tondo":       [...manilaRange(1, 267), "1303901922"],
};