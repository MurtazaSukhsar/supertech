export type Category = {
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  image: string
  subcategories: string[]
}

export type Product = {
  id: string
  name: string
  category: string
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
      'Copper pipes, insulation, refrigerants, dampers, access valves, flexible ducts, and materials for professional HVAC installation.',
    icon: 'wind',
    image: '/images/products/copper-coil.jpeg',
    subcategories: [
      'Copper Pipes & Coils',
      'Copper Pipes & Fittings',
      'Brass Fittings & Valves',
      'Duct Accessories & Hardware',
      'Duct Sealants & Coatings',
      'Duct Tapes & Accessories',
      'Flexible Ducts',
      'Refrigeration Components',
      'Pipe Supports & Clamps',
    ],
  },
  {
    slug: 'hardware',
    name: 'Hardware Supplies',
    shortName: 'Hardware',
    description:
      'Galvanized fasteners, conduit couplings, electrical sockets, jute hemp, test plugs, clips, and plumbing hardware.',
    icon: 'wrench',
    image: '/images/products/galvanized-fasteners.jpeg',
    subcategories: ['Fasteners & Fittings'],
  },
  {
    slug: 'tools',
    name: 'Hand & Power Tools',
    shortName: 'Tools',
    description:
      'Professional-grade hand tools and power tools from trusted brands built for daily jobsite performance.',
    icon: 'drill',
    image: '/images/products/cordless-drill.png',
    subcategories: ['Power Tools', 'Hand Tools'],
  },
  {
    slug: 'construction',
    name: 'Construction Materials',
    shortName: 'Construction',
    description:
      'Slotted unistrut channels, UPVC pipe fittings, drop-in anchors, paint brushes, wrapping tapes, and solvent thinners.',
    icon: 'building',
    image: '/images/products/slotted-channel.jpeg',
    subcategories: [
      'Structural Supports & Framing',
      'Anchoring & Fasteners',
      'Tapes & Surface Protection',
      'Chemicals & Cleaners',
      'Painting & Surface Prep',
    ],
  },
  {
    slug: 'industrial',
    name: 'Industrial Equipment',
    shortName: 'Industrial',
    description:
      'Compressors, welding machines, generators, and heavy-duty industrial equipment.',
    icon: 'factory',
    image: '/images/products/air-compressor.png',
    subcategories: ['Compressors', 'Welding'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing Supplies',
    shortName: 'Plumbing',
    description:
      'UPVC pressure & drainage fittings, test plugs, gauge cock valves, jute hemp, thread sealants, and plumbing materials.',
    icon: 'droplets',
    image: '/images/products/upvc-fitting.jpeg',
    subcategories: [
      'Plumbing & Drainage',
      'Plumbing Supplies',
      'Plumbing & Testing Equipment',
      'Plumbing & Valves',
    ],
  },
  {
    slug: 'electric',
    name: 'Electrical Supplies',
    shortName: 'Electrical',
    description:
      'Galvanized conduit couplings, industrial plugs & sockets, spring conduit clips, cable containment, and electrical hardware.',
    icon: 'zap',
    image: '/images/products/industrial-socket.jpeg',
    subcategories: ['Electrical Supplies', 'Fasteners & Clamps'],
  },
  {
    slug: 'duct-accessories',
    name: 'Duct Accessories',
    shortName: 'Duct Accessories',
    description:
      'Flexible ducts, volume control dampers, duct sealants, adhesives, acoustic insulation, vibration hangers, and ductwork hardware.',
    icon: 'fan',
    image: '/images/products/insulated-flexible-duct.jpeg',
    subcategories: [
      'Flexible Ducts',
      'Duct Sealants & Coatings',
      'Duct Tapes & Accessories',
      'Duct Accessories & Hardware',
      'Duct Accessories & Insulation',
    ],
  },
]

export const products: Product[] = [
  {
    id: 'aeroduct-flexible-connector',
    name: "Aeroduct Flexible Duct Connector Roll",
    category: 'duct-accessories',
    subcategory: 'Flexible Ducts',
    brand: 'Aeroduct',
    images: ["/images/products/aeroduct-flexible-connector.jpeg"],
    description: "Aeroduct heavy-duty flexible duct connector roll engineered for HVAC acoustic vibration isolation between air handling units and sheet metal ductwork.",
    specs: {
       
      "Brand": "Aeroduct",
      "Material": "Galvanized Steel & Heavy Canvas / Neoprene",
      "Application": "Vibration isolation & duct acoustic connection",
      "Roll Length": "28 Meter Roll"

    },
    featured: true,
  },
  {
    id: 'fischer-drop-in-anchor-box',
    name: "Fischer EA II Heavy Duty Drop-In Anchor Box",
    category: 'construction',
    subcategory: 'Anchoring & Fasteners',
    brand: 'Fischer',
    images: ["/images/products/fischer-drop-in-anchor-box.jpeg"],
    description: "Fischer EA II internal thread steel drop-in anchor set for heavy pipe suspension, unistrut channels, and concrete ceiling fixings.",
    specs: {
       
      "Brand": "Fischer",
      "Material": "Zinc-Plated Carbon Steel",
      "Application": "Concrete ceiling & MEP channel anchoring",
      "Sizes": "M6, M8, M10, M12, M16"

    },
  },
  {
    id: 'weldfix-upvc-cement',
    name: "Weldfix UPVC & CPVC Solvent Cement",
    category: 'plumbing',
    subcategory: 'Plumbing Supplies',
    brand: 'Weldfix',
    images: ["/images/products/weldfix-upvc-cement.jpeg"],
    description: "Weldfix high-strength solvent cement for fast, pressure-tight bonding of UPVC, PVC, and CPVC pressure pipes and fittings. Meets ASTM D-2564 standards.",
    specs: {
       
      "Brand": "Weldfix",
      "Standards": "ASTM D-2564 / ASTM F-493",
      "Available Sizes": "1/4 Pint (118ml), 1 Pint (473ml)",
      "Application": "UPVC & CPVC pipe joint solvent welding"

    },
    featured: true,
  },
  {
    id: 'pvc-electrical-conduit-box',
    name: "PVC Electrical Circular Conduit Junction Box",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/pvc-electrical-conduit-box.jpeg"],
    description: "Surface-mounted PVC circular conduit junction box with knockouts for protecting electrical wire joints and conduit wire splices.",
    specs: {
       
      "Available Sizes": "20mm & 25mm (1-Way, 2-Way, 3-Way, 4-Way)",
      "Material": "High-Impact Flame-Retardant PVC",
      "IP Rating": "IP65 Weatherproof",
      "Application": "Surface electrical conduit wiring connections"

    },
  },
  {
    id: 'brass-flare-nut',
    name: "Brass Flare Nut",
    category: 'air-conditioning',
    subcategory: 'Brass Fittings & Valves',
    brand: 'ST',
    images: ["/images/products/brass-flare-nut.jpeg"],
    description: "Heavy duty forged brass flare nut for connecting copper refrigeration tubing to air conditioning compressor valves and split units.",
    specs: {
       
      "Available Sizes": "1/4\", 3/8\", 1/2\", 5/8\"",
      "Material": "Forged Brass C37700",
      "Pressure Rating": "Up to 700 PSI (R410A/R32 Compatible)",
      "Standard": "SAE J513"

    },
  },
  {
    id: 'combination-wrench-set',
    name: '24-Piece Chrome Vanadium Combination Wrench Set',
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'ST',
    images: ['/images/products/wrench-set.png'],
    description:
      'Full 24-piece metric and SAE combination spanner set forged from Cr-V steel with Maxi-Drive profile to prevent fastener rounding under high torque.',
    specs: {
      Sizes: '6mm – 32mm metric',
      Material: 'Chrome Vanadium Steel',
      Finish: 'Full Polish Chrome',
      Storage: 'Roll-up heavy-duty canvas pouch',
    },
  },
  {
    id: 'mig-welding-machine-250a',
    name: 'Inverter MIG/TIG/MMA Welding Machine 250A',
    category: 'industrial',
    subcategory: 'Welding',
    brand: 'Telwin',
    images: ['/images/products/welding-machine.png'],
    description:
      'Multi-process 250A inverter welder supporting MIG/MAG flux-cored, TIG touch-start, and MMA stick welding. Ideal for structural steel fabrication and maintenance.',
    specs: {
      Output: '250 Amps max',
      DutyCycle: '60% @ 250A',
      WireSpool: '5kg / 15kg spools',
      InputVoltage: '230V Single Phase',
    },
  },
  {
    id: 'rubber-lined-clamp',
    name: "Rubber Lined Pipe Clamp",
    category: 'hardware',
    subcategory: 'Pipe Supports & Clamps',
    brand: 'ST',
    images: ["/images/products/rubber-lined-clamp.jpeg"],
    description: "Acoustic EPDM rubber-lined galvanized pipe clamp for vibration dampening and noise isolation in chilled water and domestic water supply lines.",
    specs: {
       
      "Available Sizes": "1/2\", 3/4\", 1\", 1-1/4\", 1-1/2\", 2\", 2-1/2\", 3\", 4\", 6\"",
      "Lining": "EPDM Rubber Insulation",
      "Material": "Galvanized Steel",
      "Noise Reduction": "Up to 18 dB"

    },
  },
  {
    id: 'rubber-cork-pad',
    name: "Rubber Cork Anti-Vibration Pad",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/rubber-cork-pad.jpeg"],
    description: "High-density rubber cork composite pad for under-equipment vibration dampening on chillers, pumps, and compressors.",
    specs: {
       
      "Available Sizes": "4\"x4\"x7/8\", 4\"x4\"x2\", 3\"x3\"x7/8\"",
      "Material": "Neoprene Rubber & Natural Cork Composite"

    },
  },
  {
    id: 'gi-unistrut-channel-bracket',
    name: "GI Unistrut Cantilever Framing Bracket",
    category: 'construction',
    subcategory: 'Structural Supports & Framing',
    brand: 'ST',
    images: ["/images/products/gi-unistrut-channel-bracket.jpeg"],
    description: "Hot-dip galvanized steel cantilever arm support bracket for mounting unistrut channels, heavy ductwork, and cable trays to walls.",
    specs: {
       
      "Available Lengths": "150mm, 300mm, 450mm, 600mm",
      "Material": "Hot-Dip Galvanized Steel (HDG)",
      "Application": "Heavy MEP pipe rack & duct wall mounting"

    },
  },
  {
    id: 'brass-gate-valve',
    name: "Brass Heavy-Duty Gate Valve",
    category: 'plumbing',
    subcategory: 'Plumbing & Valves',
    brand: 'ST',
    images: ["/images/products/brass-gate-valve.jpeg"],
    description: "Forged brass heavy-duty inline gate valve with red cast iron handwheel for reliable fluid shutoff control in water, HVAC, and plumbing lines.",
    specs: {
       
      "Available Sizes": "1/2\", 3/4\", 1\", 1-1/4\", 1-1/2\", 2\"",
      "Material": "Forged Brass Body (CW617N)",
      "Pressure Rating": "PN20 / 300 PSI",
      "Application": "HVAC chilled water & plumbing shutoff valve"

    },
  },
  {
    id: 'gi-electric-conduit-pipe',
    name: "GI Electric Conduit Pipe",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/gi-electric-conduit-pipe.jpeg"],
    description: "Class 4 hot-dip galvanized rigid steel electrical conduit pipe for surface and underground cable protection.",
    specs: {
       
      "Available Sizes": "3/4\", 1\", 1-1/2\"",
      "Standard": "BS 31 / BS 4568 / BS EN 61386",
      "Material": "Hot-Dip Galvanized Rigid Steel"

    },
  },
  {
    id: 'copper-fitting',
    name: 'Wrot Copper Fittings Set',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes & Fittings',
    images: ['/images/products/copper-fitting.jpeg'],
    description:
      'Precision-manufactured wrot copper solder fittings including 90° elbows, 45° elbows, tees, couplings, reducers, and flare adapters. Engineered for pressure-tight solder joints in HVAC, refrigeration, and plumbing installations.',
    specs: {
      Sizes: 'All standard sizes (1/4" to 2-1/8")',
      Material: 'High-purity C12200 Deoxidized Copper',
      Standard: 'ASME B16.22 / EN 1254',
      Origin: 'China',
      Application: 'Air conditioning & refrigeration solder connections',
    },
  },
  {
    id: 'socket-wrench-set',
    name: "94-Piece 1/2\" & 1/4\" Drive Socket Wrench Tool Set",
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'ST',
    images: ["/images/products/wrench-set.png"],
    description: "Professional 94-piece Chrome Vanadium socket and ratchet wrench tool set in a heavy-duty blow-molded case. Ideal for MEP installation, automotive, and plant maintenance.",
    specs: {
       
      "Piece Count": "94 Pieces",
      "Material": "Drop-Forged Chrome Vanadium Steel (Cr-V)",
      "Drive Sizes": "1/2\" & 1/4\" Ratchet Drives",
      "Includes": "Metric & SAE Sockets, Deep Sockets, Extensions, Universal Joints",
      "Case": "Impact-Resistant Blow Mold Storage Case"

    },
    featured: true,
  },
  {
    id: 'gi-channel-clamp',
    name: "GI Channel Clamp",
    category: 'hardware',
    subcategory: 'Pipe Supports & Clamps',
    brand: 'ST',
    images: ["/images/products/gi-channel-clamp.jpeg"],
    description: "Galvanized strut channel clamp designed for securing pipes directly onto 41x41mm and 41x21mm unistrut metal framing channels.",
    specs: {
       
      "Available Sizes": "1/2\", 3/4\", 1\", 1-1/2\", 2\"",
      "Material": "Electro-Galvanized Steel",
      "Compatibility": "Standard 41mm Strut Channels"

    },
  },
  {
    id: 'spring-hanger-mount',
    name: "Spring Hanger Mount (10mm Hole)",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/spring-hanger-mount.jpeg"],
    description: "Compact steel spring hanger for isolated ceiling suspension of air handling units, fan coil units, and ductwork.",
    specs: {
       
      "Available Sizes": "50mm, 30mm with 10mm Rod Hole",
      "Application": "HVAC Fan & Duct Vibration Isolation"

    },
  },
  {
    id: 'pvc-pipe-wrapping-tape',
    name: 'Shurtape PVC Pipe Anti-Corrosion Wrapping Tape',
    category: 'construction',
    subcategory: 'Tapes & Surface Protection',
    brand: 'Shurtape',
    images: ['/images/products/pvc-pipe-wrapping-tape.jpeg'],
    description:
      'Heavy-duty unplasticized non-adhesive PVC pipe wrapping tape engineered for wrapping underground chilled water lines, steel pipes, and copper tubing to protect against soil corrosion, moisture ingress, and chemical degradation.',
    specs: {
      Brand: 'Shurtape',
      Width: '2 inches (50mm)',
      Material: 'Heavy-duty Non-Adhesive PVC Film',
      Color: 'Black / Black-Yellow',
      Application: 'Underground pipe corrosion protection & copper line jacketing',
    },
  },
  {
    id: 'jute-kutkut',
    name: 'Egyptian Plumbing Jute Fibre (Kutkut Hemp)',
    category: 'plumbing',
    subcategory: 'Plumbing Supplies',
    images: ['/images/products/jute-kutkut.jpeg'],
    description:
      'Premium natural Egyptian jute fiber (kutkut plumbing hemp) used in combination with pipe jointing paste for thread sealing on cast iron, galvanized steel, and brass pipe fittings in plumbing installations.',
    specs: {
      Material: '100% Natural Egyptian Long-Fibre Jute',
      Origin: 'Egypt',
      Packaging: 'Bundled hanks / coils',
      Application: 'Threaded pipe joint sealing & plumbing fit-outs',
    },
  },
  {
    id: 'electric-gi-saddle',
    name: "Electric GI Saddle Clamp",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/electric-gi-saddle.jpeg"],
    description: "Half and full galvanized iron saddle clamps for fixing electrical conduits and PVC pipes against walls and ceilings.",
    specs: {
       
      "Available Sizes": "20mm, 25mm, 38mm, 50mm",
      "Material": "Galvanized Pressed Steel"

    },
  },
  {
    id: 'filter-dryer',
    name: 'Refrigeration Liquid Line Filter Drier',
    category: 'air-conditioning',
    subcategory: 'Refrigeration Components',
    images: ['/images/products/filter-dryer.jpeg'],
    description:
      'High-capacity liquid line filter drier designed to absorb moisture, acid, and solid contaminants from HVAC and refrigeration systems. Protects thermal expansion valves and compressor mechanisms from premature wear and corrosion.',
    specs: {
      Sizes: '1/4" up to 7/8" (Flare & ODF Solder)',
      'Desiccant Core': 'Molecular Sieve & Activated Alumina',
      'Max Working Pressure': '500 PSI / 35 bar',
      Origin: 'Mexico',
      Compatibility: 'R410A, R134a, R404A, R407C, R32',
    },
  },
  {
    id: 'insulated-screwdriver-set',
    name: "1000V VDE Insulated Screwdriver Set (7-Piece)",
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'ST',
    images: ["/images/products/wrench-set.png"],
    description: "VDE certified 1000V insulated screwdriver set engineered for safe live electrical installation and panel assembly work. Tested to IEC 60900 standards.",
    specs: {
       
      "Voltage Rating": "1000V AC / 1500V DC VDE Certified",
      "Piece Count": "7 Screwdrivers (Slotted & Phillips)",
      "Standard": "IEC 60900 / DIN EN 60900",
      "Handle": "Ergonomic Anti-Slip Soft-Grip Handle"

    },
  },
  {
    id: 'gi-heavy-duty-clamp',
    name: "Heavy Duty GI Pipe Clamp",
    category: 'hardware',
    subcategory: 'Pipe Supports & Clamps',
    brand: 'ST',
    images: ["/images/products/gi-heavy-duty-clamp.jpeg"],
    description: "Industrial-grade heavy duty galvanized iron pipe clamp engineered for high-load piping infrastructure, chilled water lines, and drainage riser stacks.",
    specs: {
       
      "Available Sizes": "2-1/2\", 3\", 4\", 6\", 8\"",
      "Material": "Hot-Dip Galvanized Steel",
      "Application": "High-Load Pipe Suspension",
      "Standard": "BS 3974 / ASTM A123"

    },
  },
  {
    id: 'spring-hanger-70kg',
    name: "Spring Hanger Vibration Isolator (70kg)",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/spring-hanger-70kg.jpeg"],
    description: "Suspended spring hanger vibration isolator designed to absorb structural vibration from suspended HVAC ducts and inline fans.",
    specs: {
       
      "Load Capacity": "70 kg",
      "Hole Size": "12 mm Threaded Rod Hole",
      "Spring Material": "High-Tensile Powder Coated Steel"

    },
  },
  {
    id: 'gi-drop-in-anchor',
    name: 'Fischer Galvanized Steel Drop-In Anchor',
    category: 'construction',
    subcategory: 'Anchoring & Fasteners',
    brand: 'Fischer',
    images: ['/images/products/fasteners-set.png'],
    description:
      'Fischer internal thread drop-in expansion anchor manufactured from galvanized steel. Ideal for flush mounting in concrete to secure threaded suspension rods, HVAC duct hangers, and pipe cradles.',
    specs: {
      Brand: 'Fischer',
      Sizes: 'Up to 12mm (M6, M8, M10, M12)',
      Material: 'Galvanized Carbon Steel',
      Installation: 'Internal expander plug flush installation in concrete',
      Application: 'HVAC duct hangers & heavy pipe suspension',
    },
  },
  {
    id: 'cock-valves',
    name: 'Brass Gauge Cock Valve',
    category: 'plumbing',
    subcategory: 'Plumbing & Valves',
    images: ['/images/products/brass-union.jpeg'],
    description:
      'Heavy-duty forged brass gauge cock shut-off valve designed for isolating pressure gauges and regulating airflow/liquid lines on plumbing, HVAC, and industrial piping manifolds.',
    specs: {
      Sizes: '1/4" and 1/2" NPT Male/Female',
      Material: 'Forged Brass Body with T-Handle',
      'Working Pressure': '200 PSI WOG',
      Application: 'Pressure gauge isolation & piping manifold flow control',
    },
  },
  {
    id: 'industrial-socket',
    name: 'Industrial Plug & Socket Connector Set',
    category: 'electric',
    subcategory: 'Electrical Supplies',
    images: ['/images/products/industrial-socket.jpeg'],
    description:
      'Heavy-duty CEE industrial plug and socket connectors engineered for high-power distribution on construction job sites, industrial workshops, and temporary site power boards. Impact-resistant and weatherproof.',
    specs: {
      Rating: '16A / 32A / 63A',
      'Voltage Range': '220V - 415V (3P+E / 3P+N+E)',
      'Enclosure Rating': 'IP44 Weatherproof / IP67 Waterproof',
      Application: 'Construction power distribution, welders, HVAC machinery',
    },
  },
  {
    id: 'pvc-packing-strap',
    name: 'High-Tensile PVC Packing Strapping Roll',
    category: 'air-conditioning',
    subcategory: 'Packaging & Duct Strapping',
    images: ['/images/products/pvc-packing-strap.jpeg'],
    description:
      'High-strength flexible plastic packing strap roll used for bundling sheet metal ductwork, securing palletized HVAC materials, binding pipe bundles, and jobsite material packaging.',
    specs: {
      Width: '5/8" (16mm)',
      'Roll Sizes': 'Small roll & Large commercial coil options',
      Material: 'High-density Polypropylene / PVC compound',
      Application: 'Pallet strapping, duct bundling, & cargo securing',
    },
  },
  {
    id: 'rotary-hammer-drill',
    name: "Heavy Duty SDS-Plus Rotary Hammer Drill (800W)",
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'ST',
    images: ["/images/products/cordless-drill.png"],
    description: "Industrial-grade SDS-Plus 3-mode rotary hammer drill engineered for high-impact drilling and chiseling into concrete, masonry, and steel. Features safety clutch and vibration control.",
    specs: {
       
      "Power Input": "800 Watts",
      "Impact Energy": "3.0 Joules",
      "Max Concrete Drilling": "26 mm",
      "Modes": "Drilling, Hammer Drilling, Chiseling",
      "Chuck Type": "SDS-Plus Quick Change"

    },
    featured: true,
  },
  {
    id: 'gi-u-clamp-saddle',
    name: "GI U Clamp Saddle",
    category: 'hardware',
    subcategory: 'Pipe Supports & Clamps',
    brand: 'ST',
    images: ["/images/products/gi-u-clamp-saddle.jpeg"],
    description: "Galvanized steel U-bolt clamp saddle for securing heavy steel pipes, conduits, and copper risers to structural surfaces.",
    specs: {
       
      "Available Sizes": "3/4\", 1\", 1-1/4\", 1-1/2\", 2\", 4\"",
      "Material": "Electro-Galvanized Steel",
      "Application": "Surface Mounted Pipe & Conduit Clamping"

    },
  },
  {
    id: 'cotton-canvas-cloth',
    name: 'Cotton Canvas Cloth',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ['/images/products/cotton-canvas-cloth.jpeg'],
    description:
      'Premium heavy-duty woven cotton canvas cloth used as a protective outer jacketing and vapor barrier covering for thermal insulation on HVAC air ducts and chilled water piping. Delivers high tensile strength, excellent adhesive absorption, and a smooth protective finish.',
    specs: {
      'Roll Dimensions': '36" x 18m',
      'Weight / Density': '6 oz & 8 oz options',
      Origin: 'Pakistan & India',
      Brand: 'ST',
      Application: 'Duct thermal insulation protection & lagging wrapper',
    },
  },
  {
    id: 'gi-beam-clamp',
    name: "GI Beam Clamp",
    category: 'construction',
    subcategory: 'Structural Supports & Framing',
    brand: 'ST',
    images: ["/images/products/gi-beam-clamp.jpeg"],
    description: "Malleable iron galvanized structural beam clamp for attaching threaded rods to steel I-beams without drilling or welding.",
    specs: {
       
      "Available Sizes": "8mm, 10mm, 12mm Threaded Rod Hole",
      "Material": "Malleable Cast Iron (Galvanized)",
      "Load Capacity": "Up to 450 kg",
      "Standard": "MSS SP-69"

    },
  },
  {
    id: 'test-plug',
    name: 'Brass Pressure & Temperature Test Plug (Pete\'s Plug)',
    category: 'plumbing',
    subcategory: 'Plumbing & Testing Equipment',
    images: ['/images/products/test-plug.jpeg'],
    description:
      'Solid brass 1/4" NPT pressure test plug (Pete\'s Plug) fitted with self-closing dual neoprene internal seals. Allows technician to quickly insert pressure/temperature probes without fluid leakage.',
    specs: {
      'Thread Size': '1/4" NPT Male Thread',
      Material: 'Solid Machined Brass with Neoprene Elastomer Core',
      'Pressure Rating': '500 PSI Maximum',
      Application: 'Chilled water loop & hydronic system testing port',
    },
  },
  {
    id: 'electric-brass-adaptor',
    name: "Electric Brass Adaptor",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/electric-brass-adaptor.jpeg"],
    description: "Precision machined brass electrical conduit male/female adaptor for securing flexible and rigid metal conduits to junction boxes and enclosures.",
    specs: {
       
      "Available Sizes": "3/4\", 1\", 1-1/2\"",
      "Material": "High-Grade Extruded Brass",
      "Thread Standard": "BS 4568 / Metric",
      "Protection Class": "IP66 Rated"

    },
  },
  {
    id: 'wooden-support',
    name: 'Hardwood Insulated Pipe Support Blocks',
    category: 'air-conditioning',
    subcategory: 'Pipe Supports & Clamps',
    images: ['/images/products/wooden-support.jpeg'],
    description:
      'High-density treated hardwood pipe support blocks designed to support insulated copper tubing and chilled water lines without compressing thermal insulation. Prevents thermal bridging, sweating, and moisture condensation.',
    specs: {
      Sizes: 'All pipe sizes (1/4" to 4"+)',
      Material: 'Seasoned Treated Hardwood / Phenolic Resin',
      Subcategory: 'Clamps & Supports',
      Application: 'Chilled water & refrigerant pipe suspension',
    },
  },
  {
    id: 'angle-grinder-5in',
    name: '5" Angle Grinder 1100W',
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'ST',
    images: ['/images/products/angle-grinder.png'],
    description:
      'High-output 1100W angle grinder designed for cutting steel rebar, grinding welds, and masonry slotting with restart protection and burst-proof guard.',
    specs: {
      Power: '1100 Watts',
      Disc: '125 mm (5 inch)',
      Speed: '11,000 RPM',
      Voltage: '220-240V',
    },
  },
  {
    id: 'gi-universal-clamp',
    name: "GI Universal Pipe Clamp",
    category: 'hardware',
    subcategory: 'Pipe Supports & Clamps',
    brand: 'ST',
    images: ["/images/products/gi-universal-clamp.jpeg"],
    description: "Heavy-duty galvanized iron universal pipe clamp for MEP, HVAC, and plumbing pipe installations. Features dual screw clamping mechanism and zinc plating.",
    specs: {
       
      "Available Sizes": "1\", 1-1/4\", 1-1/2\", 2\", 2-1/2\", 3\", 4\", 6\"",
      "Material": "Electro-Galvanized Iron (GI)",
      "Application": "MEP & HVAC Pipe Hangers",
      "Origin": "UAE / China"

    },
  },
  {
    id: 'rubber-waffle-sheet-thin',
    name: "Rubber Waffle Isolation Sheet (3/8\")",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/rubber-waffle-sheet-thin.jpeg"],
    description: "Cross-ribbed neoprene rubber waffle pad sheet providing high deflection acoustic isolation under mechanical equipment.",
    specs: {
       
      "Available Sizes": "18\" x 18\" x 3/8\"",
      "Material": "Heavy Duty Oil-Resistant Neoprene Rubber"

    },
  },
  {
    id: 'slotted-channel',
    name: 'Slotted Metal Strut Channel (Unistrut Profile)',
    category: 'construction',
    subcategory: 'Structural Supports & Framing',
    images: ['/images/products/slotted-channel.jpeg'],
    description:
      'Cold-formed slotted structural steel framing channels (unistrut profile) with pre-galvanized finish. Provides versatile overhead support framing for hanging HVAC ductwork, heavy pipe runs, electrical cable trays, and equipment.',
    specs: {
      Profiles: '27x18mm, 41x21mm, 41x41mm',
      Length: '3 meter standard length',
      Material: 'Pre-Galvanized Structural Steel',
      Pattern: 'Continuous slotted back for quick bolt alignment',
    },
    featured: true,
  },
  {
    id: 'metal-clip',
    name: 'Galvanized Spring Metal Conduit Clip',
    category: 'electric',
    subcategory: 'Fasteners & Clamps',
    images: ['/images/products/metal-clip.jpeg'],
    description:
      'Heavy-gauge galvanized steel spring clip saddle designed for securing electrical conduits, copper tubes, and small steel pipes to masonry walls, metal studs, or unistrut channels.',
    specs: {
      Size: '5/8" diameter',
      Material: 'Galvanized Spring Steel',
      Finish: 'Zinc-Plated Rust Resistant',
      Application: 'Conduit & copper tube wall attachment',
    },
  },
  {
    id: 'copper-coil',
    name: 'Seamless Soft Copper Pipe Coil',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes & Coils',
    images: ['/images/products/copper-coil.jpeg'],
    description:
      'Seamless soft copper pancake coil manufactured to ASTM B280 international standards for air conditioning and refrigeration field service. Fully annealed for easy hand bending, flaring, and installation in residential and commercial split A/C refrigerant lines.',
    specs: {
      Sizes: '1/4" to 7/8" OD',
      Standard: 'ASTM B280 / EN 12735-1',
      Origin: 'Vietnam',
      Type: 'Soft Annealed Pancake Coil',
      Application: 'Split A/C refrigerant lines (R410A, R32, R22)',
    },
    featured: true,
  },
  {
    id: 'circular-saw-7in',
    name: "7-1/4\" Industrial Circular Saw (1400W)",
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'ST',
    images: ["/images/products/angle-grinder.png"],
    description: "Powerful 1400W 7-1/4 inch handheld circular saw designed for precise straight ripping and cross-cutting of plywood, hardwood, formwork, and plastic sheets.",
    specs: {
       
      "Blade Diameter": "7-1/4\" (185mm)",
      "Power Input": "1400 Watts",
      "Cutting Depth @ 90\u00b0": "64 mm",
      "Bevel Capacity": "0\u00b0 to 45\u00b0",
      "No-Load Speed": "5500 RPM"

    },
  },
  {
    id: 'pvc-flexible-duct',
    name: 'Heavy Duty PVC Flexible Air Duct',
    category: 'duct-accessories',
    subcategory: 'Flexible Ducts',
    images: ['/images/products/pvc-flexible-duct.jpeg'],
    description:
      'Non-insulated flexible duct fabricated from tough PVC foil laminate reinforced with a high-tensile spring steel wire helix. Offers outstanding tear resistance, chemical resistance, and smooth internal airflow for exhaust and supply air drops.',
    specs: {
      Sizes: '4" up to 16" diameter',
      'Core Material': 'PVC Foil Laminate with Steel Spring Wire Core',
      Color: 'Grey / Black',
      'Operating Temp': '-20°C to +80°C',
      Application: 'Fume extraction, bathroom exhaust, ventilation drops',
    },
  },
  {
    id: 'thinner',
    name: 'Industrial Solvent Thinner & Cleaner',
    category: 'construction',
    subcategory: 'Chemicals & Cleaners',
    images: ['/images/products/duct-insulation-coating.jpeg'],
    description:
      'High-purity industrial solvent thinner formulated for thinning duct contact adhesives, mastic coatings, paints, and primers, as well as cleaning application brushes, spray equipment, and jobsite tools.',
    specs: {
      Packaging: '1 Gallon & 5 Gallon metal drums',
      Type: 'High-Purity Hydrocarbon Solvent Blend',
      Application: 'Solvent thinning, tool cleaning, & surface degreasing',
    },
  },
  {
    id: 'pvc-coated-flexible-conduit',
    name: "PVC Coated Flexible Conduit Pipe",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/pvc-coated-flexible-conduit.jpeg"],
    description: "Liquid-tight PVC coated flexible galvanized steel conduit for weatherproof outdoor and industrial electrical wiring runs.",
    specs: {
       
      "Available Sizes": "3/4\", 1\", 1-1/2\"",
      "Material": "Galvanized Steel Core with Black PVC Jacket",
      "IP Rating": "IP67 Liquid Tight"

    },
  },
  {
    id: 'access-valves',
    name: 'Refrigeration Service Access Valve 1/4"',
    category: 'air-conditioning',
    subcategory: 'Refrigeration Components & Valves',
    images: ['/images/products/access-valves.jpeg'],
    description:
      'Standard 1/4" SAE flare refrigeration service access valve (Schrader valve) complete with removable internal core, 1/4" copper tube tail, and knurled brass cap with core remover tool.',
    specs: {
      'Connection Size': '1/4" SAE Flare x 1/4" OD Copper Tube',
      Material: 'Solid Forged Brass Body & Pure Copper Tail',
      'Internal Core': 'Removable High-Pressure Stainless Core',
      Application: 'A/C refrigerant charging, vacuum evacuation, & pressure testing',
    },
    featured: true,
  },
  {
    id: 'heavy-duty-pliers-set',
    name: "4-Piece Industrial Pliers Set",
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'ST',
    images: ["/images/products/wrench-set.png"],
    description: "Heavy-duty 4-piece forged pliers set including 8\" combination pliers, 8\" long nose pliers, 7\" diagonal side cutters, and 10\" adjustable water pump pliers.",
    specs: {
       
      "Piece Count": "4 Pliers Set",
      "Material": "Induction-Hardened Chrome Vanadium Steel",
      "Handles": "Bi-Material Heavy Duty Grip Handles",
      "Includes": "Combination, Long Nose, Diagonal Cutter, Water Pump Pliers"

    },
  },
  {
    id: 'nbr-insulation-roll',
    name: "NBR Rubber Insulation Roll (GoFlex)",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'GoFlex',
    images: ["/images/products/nbr-insulation-roll.jpeg"],
    description: "Flexible NBR closed-cell synthetic rubber insulation sheet roll for wrapping large HVAC ductwork, tanks, and large diameter pipes.",
    specs: {
       
      "Dimensions": "1/2\" Thickness x 1mtr Width x 14mtr Length",
      "Fire Rating": "Class 0 / Class 1 (BS 476 Part 6/7)",
      "Brand": "GoFlex Aeroflex NBR"

    },
  },
  {
    id: 'electric-brass-male-bush',
    name: "Electric Brass Male Bush",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/electric-brass-male-bush.jpeg"],
    description: "Short pattern brass male bush for electrical conduit entry into switchgear panels and steel trunking boxes.",
    specs: {
       
      "Available Sizes": "3/4\", 1\", 1-1/2\"",
      "Material": "Solid Machined Brass",
      "Standard": "BS 4568 Part 2"

    },
  },
  {
    id: 'copper-pipe',
    name: 'Copper Pipe',
    category: 'air-conditioning',
    subcategory: 'Copper Pipes & Coils',
    images: ['/images/products/copper-pipe.jpeg'],
    description:
      'Seamless hard-drawn copper tubes engineered for high-pressure HVAC, chilled water, and refrigeration systems. Available in Type L and Type K wall thicknesses providing high tensile strength, superior corrosion resistance, and high burst pressure reliability.',
    specs: {
      Sizes: '3/8" up to 2-1/8"',
      'Wall Thickness': 'Type L (Standard) & Type K (Heavy Duty)',
      Standard: 'ASTM B88 / ASTM B280',
      Length: '6 meter straight lengths',
      Application: 'Commercial HVAC chilled water & refrigerant piping',
    },
  },
  {
    id: 'laser-distance-meter',
    name: "100m Digital Laser Distance Meter",
    category: 'tools',
    subcategory: 'Hand Tools',
    brand: 'ST',
    images: ["/images/products/cordless-drill.png"],
    description: "High-precision 100-meter digital laser rangefinder distance meter featuring indirect Pythagorean measurements, area calculation, volume calculation, and backlit LCD.",
    specs: {
       
      "Measuring Range": "0.05m to 100m",
      "Accuracy": "\u00b11.5 mm",
      "Functions": "Distance, Area, Volume, Continuous, Pythagoras",
      "IP Rating": "IP54 Dust & Splash Water Resistant"

    },
  },
  {
    id: 'aluminium-rivet',
    name: 'Aluminium Blind Pop Rivets',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Fasteners',
    images: ['/images/products/aluminium-rivet.jpeg'],
    description:
      'Precision-engineered aluminium blind pop rivets featuring high-strength steel mandrels. Ideal for fast, permanent mechanical joining of sheet metal ductwork, aluminum cladding, and ventilation duct flanges.',
    specs: {
      Sizes: '4x8mm, 4x10mm, 4x12mm, 5x12mm',
      'Body Material': 'High-Purity Aluminium Alloy',
      Mandrel: 'Zinc-Plated Carbon Steel',
      Origin: 'India',
      Packaging: '1000 pcs per box',
    },
  },
  {
    id: 'gi-conduit-fitting',
    name: "GI Electric Conduit Fitting Box",
    category: 'electric',
    subcategory: 'Electrical Supplies',
    brand: 'ST',
    images: ["/images/products/gi-conduit-fitting.jpeg"],
    description: "Malleable iron galvanized electrical conduit junction box for heavy duty commercial and industrial wiring runs.",
    specs: {
       
      "Available Sizes": "3/4\", 1\"",
      "Material": "Galvanized Malleable Iron",
      "Finish": "Hot-Dip Galvanized"

    },
  },
  {
    id: 'brass-union',
    name: 'Extruded Brass Flare Union Coupling',
    category: 'air-conditioning',
    subcategory: 'Brass Fittings & Valves',
    images: ['/images/products/brass-union.jpeg'],
    description:
      'Precision-machined extruded brass flare union coupling designed to connect two copper lines with gas-tight metal-to-metal 45° SAE flare seals. Built to withstand high-pressure refrigerant gases.',
    specs: {
      Sizes: 'All standard sizes (1/4" to 3/4" SAE flare)',
      Material: 'Heavy Extruded Brass (CW617N / C36000)',
      'Pressure Rating': 'Up to 700 PSI R410A / R32 compatible',
      Application: 'Split unit air conditioner copper pipe jointing',
    },
  },
  {
    id: 'impact-driver-20v',
    name: "20V Cordless Brushless Impact Driver",
    category: 'tools',
    subcategory: 'Power Tools',
    brand: 'ST',
    images: ["/images/products/cordless-drill.png"],
    description: "High-torque 20V brushless impact driver delivering 200Nm of fastening torque for heavy structural screws, duct hanging, and MEP framing assembly.",
    specs: {
       
      "Voltage": "20V Max Lithium-Ion",
      "Max Torque": "200 Nm",
      "No-Load Speed": "0-3200 RPM",
      "Chuck": "1/4\" Hex Quick Release",
      "Motor": "Brushless Heavy Duty"

    },
  },
  {
    id: 'rubber-metal-pad',
    name: "Rubber Metal Isolation Pad",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/rubber-metal-pad.jpeg"],
    description: "Steel-reinforced elastomeric isolation pad engineered for heavy equipment inertia bases and generator set mounting.",
    specs: {
       
      "Available Sizes": "100x100x40mm, 150x150x40mm",
      "Material": "Vulcanized EPDM Rubber with Steel Plate Insert"

    },
  },
  {
    id: 'rubber-waffle-sheet',
    name: "Rubber Waffle Isolation Sheet (3/4\")",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/rubber-waffle-sheet.jpeg"],
    description: "Heavy duty 3/4 inch thick ribbed elastomeric waffle vibration isolation pad sheet for HVAC chillers and air handling units.",
    specs: {
       
      "Available Sizes": "18\" x 18\" x 3/4\"",
      "Material": "Molded Neoprene Elastomer"

    },
  },
  {
    id: 'aluminum-clip',
    name: 'Lightweight Aluminum Securing Clip',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Hardware',
    images: ['/images/products/aluminum-clip.jpeg'],
    description:
      'Lightweight corrosion-resistant aluminum clips designed for mounting light-gauge flexible duct drops, securing foil insulation outer wraps, and organizing wire runs inside HVAC enclosures.',
    specs: {
      Size: '1/2"',
      Material: 'Commercial Grade Aluminum',
      Application: 'Securing flexible ducts & foil insulation jackets',
    },
  },
  {
    id: 'spring-hanger-isolator',
    name: "Spring Hanger Vibration Isolator",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/spring-hanger-isolator.jpeg"],
    description: "Heavy capacity spring hanger mount for isolating low-frequency mechanical vibration in heavy piping and HVAC ductwork.",
    specs: {
       
      "Load Capacity": "50kg, 100kg, 150kg",
      "Features": "Powder Coated Steel Spring with Neoprene Cup"

    },
  },
  {
    id: 'rubber-foam-insulation',
    name: "Rubber Foam Pipe Insulation Tube",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'Aeroduct',
    images: ["/images/products/rubber-foam-insulation.jpeg"],
    description: "Closed-cell elastomeric NBR rubber foam insulation tube for copper refrigerant lines and chilled water pipes.",
    specs: {
       
      "Wall Thickness": "3/8\", 3/4\"",
      "Available Sizes": "1/4\" Upto 2-1/8\" Pipe Diameter",
      "Thermal Conductivity": "0.034 W/m\u00b7K at 0\u00b0C"

    },
  },
  {
    id: 'flexible-duct-connector',
    name: "Flexible Duct Connector (Canvas & Neoprene)",
    category: 'duct-accessories',
    subcategory: 'Flexible Ducts',
    brand: 'Aeroduct',
    images: ["/images/products/flexible-duct-connector.jpeg"],
    description: "Acoustic flexible duct connector roll made of heavy galvanized steel metal strip lock-seamed to durable canvas or neoprene fabric.",
    specs: {
       
      "Available Sizes": "4\" & 6\" Metal Width",
      "Fabric Options": "Heavy Duty Canvas & Fire-Retardant Neoprene",
      "Temperature Range": "-30\u00b0C to +120\u00b0C"

    },
  },
  {
    id: 'duct-sealant',
    name: 'Water-Based Elastomeric HVAC Duct Sealant',
    category: 'duct-accessories',
    subcategory: 'Duct Sealants & Coatings',
    images: ['/images/products/duct-sealant.jpeg'],
    description:
      'Premium water-based elastomeric duct joint sealant specially formulated for sealing high, medium, and low pressure sheet metal ductwork systems. Cures into a flexible, air-tight, flame-resistant seal.',
    specs: {
      Packaging: '5kg Gallon Container',
      Base: 'Water-based Elastomeric Acrylic Polymer',
      Standards: 'UL 181A-M & UL 181B-M Compliant',
      Color: 'Grey',
      Application: 'Sheet metal duct joint & flange air sealing',
    },
    featured: true,
  },
  {
    id: 'hvac-damper-fittings',
    name: 'HVAC Volume Control Damper Regulator Fittings',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Hardware',
    brand: 'ST',
    images: ['/images/products/hvac-damper-fittings.jpeg'],
    description:
      'Heavy-duty galvanized steel volume control damper quadrant regulators, dial handles, spring pins, and brass bearing hardware. Essential for fabricating, installing, and adjusting airflow volume dampers in duct distribution systems.',
    specs: {
      Brand: 'ST',
      Material: 'Galvanized Steel & Solid Brass Bearings',
      Components: 'Quadrants, Dial Regulators, Retainer Pin Set',
      Origin: 'India',
      Application: 'Airflow volume damper fabrication & adjustment',
    },
  },
  {
    id: 'galvanized-corner',
    name: 'Galvanized Duct Flange Corners (TDF/TDC)',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories',
    images: ['/images/products/galvanized-corner.jpeg'],
    description:
      'Stamped galvanized steel duct flange corners engineered for TDF/TDC transverse duct flange connection systems. Ensures rigid, square, leak-free corner seals on rectangular sheet metal ducts.',
    specs: {
      Size: '35mm (Standard TDC/TDF profile)',
      Material: 'Hot-Dip Galvanized Steel',
      Thickness: '1.0mm - 1.2mm gauge',
      Application: 'Rectangular air duct flange connection corners',
    },
  },
  {
    id: 'duct-adhesives',
    name: 'HVAC Duct Contact Adhesive',
    category: 'duct-accessories',
    subcategory: 'Duct Sealants & Coatings',
    images: ['/images/products/duct-adhesives.jpeg'],
    description:
      'High-strength solvent-based contact adhesive engineered for bonding rubber foam sheet insulation, acoustic liners, glass wool insulation, and canvas wrapping to sheet metal air conditioning ducts.',
    specs: {
      Packaging: '15kg Heavy-Duty Drum',
      Type: 'Solvent-Based Synthetic Rubber Contact Adhesive',
      'Tack Time': 'Fast-drying high immediate bond strength',
      'Temperature Range': '-20°C to 90°C',
      Application: 'Duct thermal insulation & acoustic liner bonding',
    },
  },
  {
    id: 'spring-mount-isolator',
    name: "Heavy Duty Spring Mount Isolator",
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Insulation',
    brand: 'ST',
    images: ["/images/products/spring-mount-isolator.jpeg"],
    description: "Floor-mounted heavy spring vibration isolator designed for cooling towers, chillers, and large industrial pumps.",
    specs: {
       
      "Load Capacity": "150kg, 200kg",
      "Mounting": "Base Plate with Threaded Levelling Bolt"

    },
  },
  {
    id: 'insulated-flexible-duct',
    name: 'Thermally Insulated Flexible Duct',
    category: 'duct-accessories',
    subcategory: 'Flexible Ducts',
    images: ['/images/products/insulated-flexible-duct.jpeg'],
    description:
      'High-performance insulated flexible air duct featuring a multi-ply aluminum inner core wrapped in high-density fiberglass wool insulation and protected by a durable reinforced metalized outer jacket. Prevents condensation and reduces HVAC noise transmission.',
    specs: {
      Sizes: '4" up to 16" diameter',
      'Standard Length': '25 ft (7.6m)',
      Insulation: 'Glass fiber thermal blanket',
      Origin: 'UAE',
      Application: 'HVAC air diffuser drops & ventilation ducting',
    },
    featured: true,
  },
  {
    id: 'aluminum-strap',
    name: 'Aluminum Insulation Strapping Roll',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Hardware',
    images: ['/images/products/aluminum-strap.jpeg'],
    description:
      'Commercial-grade aluminum strapping roll designed for securing sheet metal cladding, pipe insulation jackets, and fiberglass duct wraps. Weatherproof, corrosion-resistant, and easy to cut and tension.',
    specs: {
      Dimensions: '1/2" width, 10 lbs coil weight',
      Material: 'Pure Aluminum Alloy',
      Finish: 'Smooth Mill Finish',
      Application: 'HVAC thermal insulation banding & aluminum cladding securing',
    },
  },
  {
    id: 'aeroduct-banding',
    name: 'Aeroduct Galvanized Steel Banding Coil',
    category: 'duct-accessories',
    subcategory: 'Duct Accessories & Hardware',
    brand: 'Aeroduct',
    images: ['/images/products/aeroduct-banding.jpeg'],
    description:
      'Heavy-duty galvanized steel banding tape designed for securing thermal insulation, pipe jacketing, acoustic liners, and flexible duct connections. Supplied in continuous dispenser coils for quick field installation.',
    specs: {
      Brand: 'Aeroduct',
      Dimensions: '9mm width x 30m coil length',
      Material: 'Galvanized Steel',
      Packaging: '30 meter dispenser roll',
      Application: 'Pipe insulation strapping & duct cladding fixing',
    },
  }

]

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

export function getCategoryColor(slug: string): { bg: string; text: string; ring: string } {
  switch (slug) {
    case 'air-conditioning':
      return { bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/30' }
    case 'hardware':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/30' }
    case 'tools':
      return { bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/30' }
    case 'construction':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/30' }
    case 'industrial':
      return { bg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'ring-purple-500/30' }
    case 'plumbing':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-500', ring: 'ring-cyan-500/30' }
    case 'electric':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-500/30' }
    default:
      return { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/30' }
  }
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
