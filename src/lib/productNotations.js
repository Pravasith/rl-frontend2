export const typesOfPriceNotation  = (
  [
    { label: 'Choose One', value: 0 },
    { label: "per cubic feet ", value: 1 },
    { label: "per square feet", value: 2 },
    { label: "per running feet", value: 3 },
    { label: "per piece", value: 4 },
    { label: "per litre", value: 5 }
  ]
);

export const typesOfCharge = (
  [
    { label: "square feet", value: 1 },
    { label: "running feet", value: 2 },
    { label: "piece", value: 3 },
    { label: "hour", value: 4 }
  ]
);

export const installerChargeType = (installerCostType) => {

    if (installerCostType === 1) return "square feet";
    else if (installerCostType === 2) return "running feet";
    else if (installerCostType === 3) return "piece";
    else if (installerCostType === 4) return "hour";

};