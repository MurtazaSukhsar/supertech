export type Category = {
  slug: string
  name: string
  shortName: string
  description: string
  icon: string // lucide icon name mapped in components
  image: string
}

export type Product = {
  id: string
  name: string
  category: string // category slug
  subcategory: string
  brand?: string
  images: string[]
  description: string
  specs: Record<string, string>
  featured?: boolean
}

export const categories: Category[] = [
  {
    slug: 'air-conditioning',
    name: 'Air-Conditioning Materials',
    shortName: 'A/C Materials',
    description:
      'Copper pipes, insulation, refrigerants, condensers, and every material needed for professional HVAC installation and maintenance.',
    icon: 'wind',
    image: '/images/products/ac-condenser.png',
  },
  {
    slug: 'hardware',
    name: 'Hardware Supplies',
    shortName: 'Hardware',
    description:
      'Fasteners, fittings, door hardware, and general-purpose supplies for contractors and maintenance teams.',
    icon: 'wrench',
    image: '/images/products/fasteners-set.png',
  },
  {
    slug: 'tools',
    name: 'Hand & Power Tools',
    shortName: 'Tools',
    description:
      'Professional-grade hand tools and power tools from trusted brands, built for daily jobsite use.',
    icon: 'drill',
    image: '/images/products/cordless-drill.png',
  },
  {
    slug: 'construction',
    name: 'Construction Materials',
    shortName: 'Construction',
    description:
      'Cement, steel, aggregates, and core building materials supplied in bulk for projects of any scale.',
    icon: 'building',
    image: '/images/products/cement-bags.png',
  },
  {
    slug: 'industrial',
    name: 'Industrial Equipment',
    shortName: 'Industrial',
    description:
      'Compressors, welding machines, generators, and heavy-duty equipment for industrial operations.',
    icon: 'factory',
    image: '/images/products/air-compressor.png',
  },
]

export const products: Product[] = [
  // ── Air-Conditioning Materials ──────────────────────────────
  {
    id: 'copper-pipe-coil-1-4',
    name: 'Soft Copper Pipe Pancake Coil 1/4"',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes',
    brand: 'Mueller',
    images: ['/images/products/copper-pipe-coil.png'],
    description:
      'Premium-grade soft copper pancake coil for refrigerant lines in split A/C installations. Manufactured to ASTM B280 standards with a smooth internal surface for optimal refrigerant flow.',
    specs: {
      Size: '1/4 inch OD',
      Length: '15 m coil',
      Standard: 'ASTM B280',
      'Wall Thickness': '0.71 mm',
      Application: 'Refrigerant lines, split A/C',
    },
    featured: true,
  },
  {
    id: 'copper-pipe-coil-3-8',
    name: 'Soft Copper Pipe Pancake Coil 3/8"',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes',
    brand: 'Mueller',
    images: ['/images/products/copper-pipe-coil.png'],
    description:
      'Soft copper pancake coil in 3/8" diameter for suction and liquid lines. Fully annealed for easy bending and flaring on site.',
    specs: {
      Size: '3/8 inch OD',
      Length: '15 m coil',
      Standard: 'ASTM B280',
      'Wall Thickness': '0.81 mm',
    },
  },
  {
    id: 'copper-pipe-coil-1-2',
    name: 'Soft Copper Pipe Pancake Coil 1/2"',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes',
    brand: 'Mueller',
    images: ['/images/products/copper-pipe-coil.png'],
    description:
      'Heavy-duty 1/2" soft copper coil suited for larger capacity split and ducted A/C systems.',
    specs: {
      Size: '1/2 inch OD',
      Length: '15 m coil',
      Standard: 'ASTM B280',
      'Wall Thickness': '0.81 mm',
    },
  },
  {
    id: 'rubber-insulation-tube',
    name: 'Rubber Foam Insulation Tube',
    category: 'air-conditioning',
    subcategory: 'Insulation',
    brand: 'Armaflex',
    images: ['/images/products/insulation-tubes.png'],
    description:
      'Closed-cell elastomeric rubber insulation tube preventing condensation and energy loss on refrigerant pipework. UV-stabilized for Gulf climate conditions.',
    specs: {
      'Inner Diameter': '1/4" to 7/8"',
      'Wall Thickness': '9 mm / 13 mm',
      Length: '1.83 m per tube',
      'Temperature Range': '-40°C to +105°C',
      'Fire Rating': 'Class B1',
    },
    featured: true,
  },
  {
    id: 'refrigerant-r410a',
    name: 'Refrigerant Gas R410A Cylinder',
    category: 'air-conditioning',
    subcategory: 'Refrigerants',
    brand: 'Honeywell',
    images: ['/images/products/refrigerant-cylinder.png'],
    description:
      'High-purity R410A refrigerant in a disposable cylinder, suitable for modern residential and commercial A/C systems.',
    specs: {
      Type: 'R410A (HFC blend)',
      'Cylinder Size': '11.3 kg',
      Purity: '99.9%',
      Application: 'Split & package units',
    },
    featured: true,
  },
  {
    id: 'refrigerant-r22',
    name: 'Refrigerant Gas R22 Cylinder',
    category: 'air-conditioning',
    subcategory: 'Refrigerants',
    brand: 'Honeywell',
    images: ['/images/products/refrigerant-cylinder.png'],
    description:
      'Genuine R22 refrigerant for servicing legacy air-conditioning systems, supplied in sealed cylinders.',
    specs: {
      Type: 'R22 (HCFC)',
      'Cylinder Size': '13.6 kg',
      Purity: '99.9%',
      Application: 'Legacy A/C systems',
    },
  },
  {
    id: 'ac-condenser-unit',
    name: 'Split A/C Outdoor Condenser Unit 2 Ton',
    category: 'air-conditioning',
    subcategory: 'Units & Parts',
    brand: 'Super Tech',
    images: ['/images/products/ac-condenser.png'],
    description:
      'Tropicalized 2-ton outdoor condenser unit engineered for extreme Gulf summer temperatures, with corrosion-protected coils.',
    specs: {
      Capacity: '24,000 BTU (2 Ton)',
      Refrigerant: 'R410A',
      Compressor: 'Rotary',
      'Operating Range': 'Up to 55°C ambient',
      Power: '220-240V / 50Hz',
    },
    featured: true,
  },

  // ── Hardware Supplies ───────────────────────────────────────
  {
    id: 'ss-fastener-assortment',
    name: 'Stainless Steel Fastener Assortment',
    category: 'hardware',
    subcategory: 'Fasteners',
    brand: 'Hilti',
    images: ['/images/products/fasteners-set.png'],
    description:
      'Comprehensive assortment of 304 stainless steel bolts, nuts, and washers for corrosion-resistant fixing in demanding environments.',
    specs: {
      Material: 'Stainless Steel 304',
      Sizes: 'M4 – M12',
      Pieces: '850 pcs assorted',
      Finish: 'Passivated',
    },
    featured: true,
  },
  {
    id: 'anchor-bolts-heavy',
    name: 'Heavy-Duty Expansion Anchor Bolts',
    category: 'hardware',
    subcategory: 'Fasteners',
    brand: 'Hilti',
    images: ['/images/products/fasteners-set.png'],
    description:
      'Through-bolt expansion anchors for secure fixing of equipment and structural elements into concrete.',
    specs: {
      Material: 'Carbon steel, zinc plated',
      Sizes: 'M8 x 75 mm – M16 x 150 mm',
      'Load Rating': 'Up to 25 kN',
      Packaging: 'Box of 50',
    },
  },
  {
    id: 'door-hardware-set',
    name: 'Stainless Door Hinge & Handle Set',
    category: 'hardware',
    subcategory: 'Door Hardware',
    brand: 'Dorma',
    images: ['/images/products/door-hardware.png'],
    description:
      'Brushed stainless steel hinge and lever handle set for commercial and residential doors, rated for high-frequency use.',
    specs: {
      Material: 'Stainless Steel 304, brushed',
      'Hinge Size': '4" x 3" x 3 mm',
      'Cycle Rating': '200,000 cycles',
      Includes: '3 hinges, handle pair, fixings',
    },
    featured: true,
  },
  {
    id: 'galvanized-strut-channel',
    name: 'Galvanized Strut Channel 41x41',
    category: 'hardware',
    subcategory: 'Fittings & Channels',
    brand: 'Unistrut',
    images: ['/images/products/steel-rebar.png'],
    description:
      'Pre-galvanized slotted strut channel for mechanical, electrical, and HVAC support systems.',
    specs: {
      Profile: '41 x 41 mm slotted',
      Length: '3 m',
      Thickness: '2.5 mm',
      Finish: 'Pre-galvanized',
    },
  },

  // ── Hand & Power Tools ──────────────────────────────────────
  {
    id: 'cordless-drill-20v',
    name: 'Cordless Drill Driver 20V Brushless',
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'Makita',
    images: ['/images/products/cordless-drill.png'],
    description:
      'Professional brushless cordless drill driver with 2-speed gearbox and all-metal chuck, supplied with two 4.0Ah batteries and fast charger.',
    specs: {
      Voltage: '20V Max',
      Motor: 'Brushless',
      Torque: '65 Nm',
      Chuck: '13 mm keyless metal',
      Includes: '2 x 4.0Ah batteries, charger, case',
    },
    featured: true,
  },
  {
    id: 'angle-grinder-115',
    name: 'Angle Grinder 115mm 900W',
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'Bosch',
    images: ['/images/products/angle-grinder.png'],
    description:
      'Compact 900W angle grinder with restart protection and tool-free guard adjustment, ideal for cutting and grinding metal.',
    specs: {
      'Disc Size': '115 mm',
      Power: '900 W',
      'No-Load Speed': '11,000 rpm',
      Spindle: 'M14',
      Weight: '1.9 kg',
    },
    featured: true,
  },
  {
    id: 'combination-wrench-set',
    name: 'Combination Wrench Set 8–32mm',
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'Stanley',
    images: ['/images/products/wrench-set.png'],
    description:
      'Chrome vanadium combination wrench set with mirror-polish finish and anti-slip profile, in a roll-up pouch.',
    specs: {
      Material: 'Chrome Vanadium (Cr-V)',
      Sizes: '8 – 32 mm, 14 pieces',
      Finish: 'Mirror polished',
      Standard: 'DIN 3113',
    },
    featured: true,
  },
  {
    id: 'socket-set-master',
    name: 'Master Socket Set 1/2" Drive',
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'Stanley',
    images: ['/images/products/wrench-set.png'],
    description:
      '94-piece master socket set with ratchets, extensions, and bits in a heavy-duty blow-mold case.',
    specs: {
      Drive: '1/4" and 1/2"',
      Pieces: '94',
      Material: 'Chrome Vanadium (Cr-V)',
      Case: 'Blow-mold with metal latches',
    },
  },

  // ── Construction Materials ──────────────────────────────────
  {
    id: 'portland-cement-opc',
    name: 'Ordinary Portland Cement OPC 50kg',
    category: 'construction',
    subcategory: 'Cement & Aggregates',
    brand: 'KCC',
    images: ['/images/products/cement-bags.png'],
    description:
      'High-strength Ordinary Portland Cement conforming to ASTM C150 Type I, supplied by the pallet or truckload for bulk projects.',
    specs: {
      Type: 'OPC Type I',
      Standard: 'ASTM C150',
      'Bag Weight': '50 kg',
      'Compressive Strength': '≥ 42.5 MPa @ 28 days',
      'Bulk Supply': 'Pallet / truckload',
    },
    featured: true,
  },
  {
    id: 'sulphate-resistant-cement',
    name: 'Sulphate Resistant Cement SRC 50kg',
    category: 'construction',
    subcategory: 'Cement & Aggregates',
    brand: 'KCC',
    images: ['/images/products/cement-bags.png'],
    description:
      'Type V sulphate-resistant cement for foundations and structures exposed to aggressive soil and groundwater conditions.',
    specs: {
      Type: 'SRC Type V',
      Standard: 'ASTM C150',
      'Bag Weight': '50 kg',
      Application: 'Foundations, marine works',
    },
  },
  {
    id: 'steel-rebar-16mm',
    name: 'Deformed Steel Rebar 16mm Grade 60',
    category: 'construction',
    subcategory: 'Steel & Rebar',
    brand: 'United Steel',
    images: ['/images/products/steel-rebar.png'],
    description:
      'High-tensile deformed reinforcement bar in 12 m lengths, mill-certified to ASTM A615 Grade 60. Cut-and-bend service available.',
    specs: {
      Diameter: '16 mm',
      Grade: 'ASTM A615 Gr. 60',
      Length: '12 m',
      'Yield Strength': '≥ 420 MPa',
      Certification: 'Mill test certificate included',
    },
    featured: true,
  },
  {
    id: 'steel-rebar-12mm',
    name: 'Deformed Steel Rebar 12mm Grade 60',
    category: 'construction',
    subcategory: 'Steel & Rebar',
    brand: 'United Steel',
    images: ['/images/products/steel-rebar.png'],
    description:
      '12 mm deformed rebar for slabs, ties, and general reinforcement, supplied in bundles with mill certification.',
    specs: {
      Diameter: '12 mm',
      Grade: 'ASTM A615 Gr. 60',
      Length: '12 m',
      'Yield Strength': '≥ 420 MPa',
    },
  },

  // ── Industrial Equipment ────────────────────────────────────
  {
    id: 'air-compressor-100l',
    name: 'Industrial Air Compressor 100L',
    category: 'industrial',
    subcategory: 'Compressors',
    brand: 'Ingersoll Rand',
    images: ['/images/products/air-compressor.png'],
    description:
      'Belt-driven 100-litre industrial air compressor with cast-iron pump, delivering reliable air supply for workshops and production lines.',
    specs: {
      'Tank Capacity': '100 L',
      Power: '3 HP / 2.2 kW',
      'Max Pressure': '8 bar',
      'Air Delivery': '330 L/min',
      Drive: 'Belt driven, cast-iron pump',
    },
    featured: true,
  },
  {
    id: 'inverter-welder-200a',
    name: 'Inverter Welding Machine 200A',
    category: 'industrial',
    subcategory: 'Welding',
    brand: 'Lincoln Electric',
    images: ['/images/products/welding-machine.png'],
    description:
      'Portable IGBT inverter arc welder with hot start and anti-stick, supplied with earth clamp and electrode holder.',
    specs: {
      'Output Current': '20 – 200 A',
      'Duty Cycle': '60% @ 200A',
      Input: '220V / 50Hz single phase',
      Electrode: 'Up to 4.0 mm',
      Weight: '5.8 kg',
    },
    featured: true,
  },
  {
    id: 'inverter-welder-300a',
    name: 'Heavy-Duty Inverter Welder 300A',
    category: 'industrial',
    subcategory: 'Welding',
    brand: 'Lincoln Electric',
    images: ['/images/products/welding-machine.png'],
    description:
      'Three-phase 300A inverter welding machine for structural fabrication and heavy industrial applications.',
    specs: {
      'Output Current': '30 – 300 A',
      'Duty Cycle': '60% @ 300A',
      Input: '380V / 3-phase',
      Electrode: 'Up to 5.0 mm',
    },
  },
  // ── Newly Added Products ────────────────────────────────────
  {
    id: 'rubber-foam-sheet',
    name: 'RUBBERFOAMSHEET',
    category: 'air-conditioning',
    subcategory: 'Insulation',
    brand: 'GoFlex',
    images: ['/images/products/rubber-foam-sheet.jpg'],
    description: 'Professional grade GoFlex NBR Rolls Rubber Foam Sheet for thermal insulation, acoustics, and vibration control in HVAC applications.',
    specs: {
      'Available Size': '1/2"Thickness x 1mtr x14mtr',
      'Material': 'NBR Rubber Foam'
    }
  },
  {
    id: 'flexible-duct-connector',
    name: 'FLEXIBLE DUCT CONNECTOR',
    category: 'air-conditioning',
    subcategory: 'Ducting',
    brand: 'Hira AERODUCT',
    images: ['/images/products/flexible-duct-connector.jpg'],
    description: 'Hira Aeroduct flexible duct connector for isolation of vibration and noise in HVAC ductwork.',
    specs: {
      'Available Size': '4"&6"',
      'Dimensions': '60X100X67',
      'Fabric Length': '75FT'
    }
  },
  {
    id: 'rubber-foam-insulation',
    name: 'RUBBERFOAMINSULATION',
    category: 'air-conditioning',
    subcategory: 'Insulation',
    images: ['/images/products/rubber-foam-insulation.jpg'],
    description: 'High performance rubber foam insulation tubes designed to prevent condensation and reduce heat loss on piping systems.',
    specs: {
      'Available Size': '1/4"Upto2-1/8"',
      'Thickness': '3/8", 3/4"'
    }
  },
  {
    id: 'pvccoatedflexible',
    name: 'PVCCOATEDFLEXIBLE',
    category: 'hardware',
    subcategory: 'Conduits',
    images: ['/images/products/pvccoatedflexible.jpg'],
    description: 'Liquid-tight PVC coated flexible steel conduit for superior electrical wiring protection in demanding environments.',
    specs: {
      'Available Size': '3/4",1",1-1/2”'
    }
  },
  {
    id: 'gi-universal-clamp',
    name: 'GIUNIVERSALCLAMP',
    category: 'hardware',
    subcategory: 'Clamps',
    images: ['/images/products/gi-universal-clamp.jpg'],
    description: 'Galvanized iron universal pipe clamp for securing pipelines and tubes to strut channels or walls.',
    specs: {
      'Available Sizes': '1",1-1/4",1-1/2",2",2-1/2",3",4",6”'
    }
  },
  {
    id: 'rubber-clamp',
    name: 'RUBBERCLAMP',
    category: 'hardware',
    subcategory: 'Clamps',
    images: ['/images/products/rubber-clamp.jpg'],
    description: 'Durable rubber lined cushion clamp for sound absorption, vibration dampening, and secure pipe mounting.',
    specs: {
      'Available Sizes': '1/2”,3/4”,1”,1-1/4”,1-1/2”,2”,3”,4”,6”8'
    }
  },
  {
    id: 'gi-g-clamp',
    name: 'GI "G" CLAMP',
    category: 'hardware',
    subcategory: 'Clamps',
    images: ['/images/products/gi-g-clamp.jpg'],
    description: 'Heavy duty galvanized iron G clamp designed for hanging and fastening applications.',
    specs: {
      'Available Size': '8mm'
    }
  },
  {
    id: 'gi-clevis-hanger',
    name: 'GICLEVIS HANGER',
    category: 'hardware',
    subcategory: 'Hangers',
    images: ['/images/products/gi-clevis-hanger.jpg'],
    description: 'Adjustable galvanized iron clevis hanger for suspending non-insulated stationary pipe lines.',
    specs: {
      'Available Sizes': '2-1/2”,3",4"6"8'
    }
  },
  {
    id: 'electricgisaddle',
    name: 'ELECTRICGISADDLE',
    category: 'hardware',
    subcategory: 'Saddles',
    images: ['/images/products/electricgisaddle.jpg'],
    description: 'Galvanized iron conduit saddle for electrical wiring installations and securing conduit pipes to surfaces.',
    specs: {
      'Available Sizes': '20mm,25mm,38mm,50mm'
    }
  },
  {
    id: 'giuclampsaddle',
    name: 'GIUCLAMPSADDLE',
    category: 'hardware',
    subcategory: 'Saddles',
    images: ['/images/products/giuclampsaddle.jpg'],
    description: 'Galvanized iron U-clamp saddle providing sturdy support and anchor for pipes and tubes.',
    specs: {
      'Available Size': '3/4",1",1-1/4",1-1/2",2",4”'
    }
  },
  {
    id: 'gibeamclamp',
    name: 'GIBEAMCLAMP',
    category: 'hardware',
    subcategory: 'Clamps',
    images: ['/images/products/gibeamclamp.jpg'],
    description: 'Galvanized iron beam clamp for secure structural attachments without the need for drilling or welding.',
    specs: {
      'Available Size': '8mm,10mm,12mm'
    }
  },
  {
    id: 'gielectricconduitpipe',
    name: 'GIELECTRICCONDUITPIPE',
    category: 'hardware',
    subcategory: 'Conduits',
    images: ['/images/products/gielectricconduitpipe.jpg'],
    description: 'High quality galvanized iron electrical conduit pipe for robust physical routing and protection of power cables.',
    specs: {
      'Available Size': '3/4",1",1-1/2”'
    }
  },
  {
    id: 'brassflarenut',
    name: 'BRASSFLARENUT',
    category: 'air-conditioning',
    subcategory: 'Fittings',
    images: ['/images/products/brassflarenut.jpg'],
    description: 'Precision machined heavy duty brass flare nut for connecting copper pipes in refrigerant systems.',
    specs: {
      'Available Size': '1/4",3/8",1/2",5/8" ，'
    }
  },
  {
    id: 'gichannelclamp',
    name: 'GICHANNELCLAMP',
    category: 'hardware',
    subcategory: 'Clamps',
    images: ['/images/products/gichannelclamp.jpg'],
    description: 'Galvanized iron channel clamp designed for securing pipes and conduit inside steel strut channels.',
    specs: {
      'Available Size': '1/2",3/4"1",1-1/2",2”'
    }
  },
  {
    id: 'electricbrassmalebush',
    name: 'ELECTRICBRASSMALEBUSH',
    category: 'hardware',
    subcategory: 'Bushing',
    images: ['/images/products/electricbrassmalebush.jpg'],
    description: 'Heavy duty brass male bush for conduit pipe fittings, providing a smooth entry surface to protect electrical cables.',
    specs: {
      'Available Sizes': '3/4",1",1-1/2′'
    }
  },
  {
    id: 'electricbrassadaptor',
    name: 'ELECTRICBRASSADAPTOR',
    category: 'hardware',
    subcategory: 'Adaptors',
    images: ['/images/products/electricbrassadaptor.jpg'],
    description: 'Durable brass adapter fitting for connecting and adapting electrical conduit pipes.',
    specs: {
      'Available Sizes': '3/4",1",1-1/2′'
    }
  },
  {
    id: 'rubberwafflesheet',
    name: 'RUBBERWAFFLESHEET',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/rubberwafflesheet.jpg'],
    description: 'Waffle-patterned rubber isolation sheet designed to minimize structure-borne noise and high frequency vibrations in heavy machinery.',
    specs: {
      'Available Size': '18"x18"x3/4"'
    }
  },
  {
    id: 'solidrubberpad',
    name: 'SOLIDRUBBERPAD',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/solidrubberpad.jpg'],
    description: 'Solid heavy-duty rubber pad for high load distribution, acoustic dampening, and machinery isolation.',
    specs: {
      'Available Size': '100x100x25mm,100x100x40mm'
    }
  },
  {
    id: 'springhanger',
    name: 'SPRINGHANGER',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/springhanger.jpg'],
    description: 'Vibration-isolating spring hanger designed for suspended piping, ductwork, and ceiling structures.',
    specs: {
      'Load Capacity': '50kg,100kg,150kg'
    }
  },
  {
    id: 'rubbersheet',
    name: 'RUBBERSHEET',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/rubbersheet.jpg'],
    description: 'Versatile commercial grade solid rubber sheet for gaskets, padding, sealing, and machinery lining.',
    specs: {
      'Available Size': '18"x18"x3/8”'
    }
  },
  {
    id: 'rubbermetalpad',
    name: 'RUBBERMETALPAD',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/rubbermetalpad.jpg'],
    description: 'Composite rubber-metal vibration dampening pad for high load-bearing machinery bases.',
    specs: {
      'Available Size': '100x100x40mm,150x150x40mm'
    }
  },
  {
    id: 'rubbercorksheet',
    name: 'RUBBERCORKSHEET',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/rubbercorksheet.jpg'],
    description: 'Premium rubberized cork isolation sheet combining the elasticity of rubber and compressibility of cork for sealing and mounting.',
    specs: {
      'Available Size': '18"x18"x7/8"'
    }
  },
  {
    id: 'housingspringmount',
    name: 'HOUSINGSPRING MOUNT',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/housingspringmount.jpg'],
    description: 'Fully housed steel spring vibration mount with elastomeric acoustic cup for industrial fan, pump, and compressor installations.',
    specs: {
      'Load Capacity': '150kg,200kg'
    }
  },
  {
    id: 'rubbercorkpad',
    name: 'RUBBERCORKPAD',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/rubbercorkpad.jpg'],
    description: 'Rubber-cork composition pad for heavy-duty load bearing, vibration isolation, and structural dampening.',
    specs: {
      'Available Size': '4"x4"x7/8",4"x4"x2",3"x3"x7/8’'
    }
  },
  {
    id: 'av-hanger',
    name: 'A V Hanger',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/av-hanger.jpg'],
    description: 'Acoustic vibration hanger with premium grade rubber isolator for suspended HVAC equipment and piping.',
    specs: {
      'Load Capacity': '70kg with 12mm hole'
    }
  },
  {
    id: 'av-mount',
    name: 'AVMount',
    category: 'industrial',
    subcategory: 'Vibration Isolation',
    images: ['/images/products/av-mount.jpg'],
    description: 'Anti-vibration rubber mount providing robust vibration damping and noise reduction for mechanical equipment mounts.',
    specs: {
      'Available Sizes': '50mm,30mm with 10mm Hole'
    }
  },
]

export type CategoryColor = {
  hex: string
  border: string
  bg: string
  text: string
  ring: string
}

export const categoryColors: Record<string, CategoryColor> = {
  'air-conditioning': {
    hex: '#2563EB',
    border: 'border-[#2563EB]',
    bg: 'bg-[#2563EB]/10',
    text: 'text-[#2563EB]',
    ring: 'ring-[#2563EB]',
  },
  hardware: {
    hex: '#D91E2A',
    border: 'border-[#D91E2A]',
    bg: 'bg-[#D91E2A]/10',
    text: 'text-[#D91E2A]',
    ring: 'ring-[#D91E2A]',
  },
  tools: {
    hex: '#DC2626',
    border: 'border-[#DC2626]',
    bg: 'bg-[#DC2626]/10',
    text: 'text-[#DC2626]',
    ring: 'ring-[#DC2626]',
  },
  construction: {
    hex: '#475569',
    border: 'border-[#475569]',
    bg: 'bg-[#475569]/10',
    text: 'text-[#475569]',
    ring: 'ring-[#475569]',
  },
  industrial: {
    hex: '#0D9488',
    border: 'border-[#0D9488]',
    bg: 'bg-[#0D9488]/10',
    text: 'text-[#0D9488]',
    ring: 'ring-[#0D9488]',
  },
}

export function getCategoryColor(slug: string): CategoryColor {
  return (
    categoryColors[slug] ?? {
      hex: '#D91E2A',
      border: 'border-accent',
      bg: 'bg-accent/10',
      text: 'text-accent',
      ring: 'ring-accent',
    }
  )
}

import { getAllActiveProducts } from './product-storage'

function getProductSource(): Product[] {
  if (typeof window !== 'undefined') {
    return getAllActiveProducts()
  }
  return products
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getProduct(id: string): Product | undefined {
  const source = getProductSource()
  return source.find((p) => p.id === id)
}

export function getProductsByCategory(slug: string): Product[] {
  const source = getProductSource()
  return source.filter((p) => p.category === slug)
}

export function getFeaturedProducts(): Product[] {
  const source = getProductSource()
  return source.filter((p) => p.featured)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const source = getProductSource()
  return source
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const source = getProductSource()
  return source.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      (p.brand ?? '').toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}

export const contactInfo = {
  companyName: 'Super Tech International Construction Materials Co.',
  tagline: 'Suppliers of All Air-Conditioning Materials, Hardware & Tools',
  email: 'supertechcm@gmail.com',
  phone: '+965 65061752',
  phoneHref: 'tel:+96565061752',
  whatsappHref: 'https://wa.me/96565061752',
  instagramHref: 'https://www.instagram.com/supertechint?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  address: 'Shuwaikh Industrial Area, Kuwait City, Kuwait',
  googleMapsUrl: 'https://maps.app.goo.gl/82yxw5UwSk57wctz9',
}
