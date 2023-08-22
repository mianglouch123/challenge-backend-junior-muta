import { request, response } from "express";

export class OptimalRecyclingController {
  run = async (req = request, res = response) => {
    let { materials, limitWeight } = req.body;

    let limit = limitWeight

    const optimalMaterials = [];
    let totalValue = 0;

    const recyclableMaterials = ["plástico", "cartón", "vidrio", "metal"];

    for (const material of materials) {
      if (recyclableMaterials.includes(material.name.toLowerCase())) {
        if (material.weight <= limitWeight) {
          optimalMaterials.push(material);
          totalValue += material.value;
          limitWeight -= material.weight;
        }
      }
    }

    return res.status(200).json({
      ok: true,
      optimalMaterials,
      totalValue,
    });
  };
}
