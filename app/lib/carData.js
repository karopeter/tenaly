// lib/carData.js

export const carMakes = [
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'Honda' },
    { id: 3, name: 'Ford' },
    { id: 4, name: 'BMW' },
    { id: 5, name: 'Mercedes' },
  ];
  
  export const carModels = {
    Toyota: [
      { id: 1, name: 'Corolla' },
      { id: 2, name: 'Camry' },
      { id: 3, name: 'Hilux' },
    ],
    Honda: [
      { id: 1, name: 'Civic' },
      { id: 2, name: 'Accord' },
      { id: 3, name: 'CR-V' },
    ],
    Ford: [
      { id: 1, name: 'Mustang' },
      { id: 2, name: 'F-150' },
      { id: 3, name: 'Explorer' },
    ],
    BMW: [
      { id: 1, name: 'X5' },
      { id: 2, name: '3 Series' },
      { id: 3, name: 'M3' },
    ],
    Mercedes: [
      { id: 1, name: 'C-Class' },
      { id: 2, name: 'E-Class' },
      { id: 3, name: 'GLC' },
    ],
  };
  

  // Manufactured years for each model
export const carYears = {
    Corolla: [2020, 2021, 2022],
    Camry: [2018, 2019, 2020],
    Highlander: [2019, 2020, 2021],
    Civic: [2017, 2018, 2019],
    Accord: [2016, 2017, 2018],
    "CR-V": [2018, 2019, 2020],
    Focus: [2015, 2016, 2017],
    "F-150": [2018, 2019, 2020],
    Mustang: [2017, 2018, 2019],
    X5: [2019, 2020, 2021],
    X3: [2018, 2019, 2020],
    "3 Series": [2017, 2018, 2019]
  };
  
  // Trim levels for each model
  export const carTrims = {
    Corolla: ["L", "LE", "XSE"],
    Camry: ["SE", "XLE", "TRD"],
    Highlander: ["LE", "XLE", "Limited"],
    Civic: ["LX", "EX", "Touring"],
    Accord: ["Sport", "EX-L", "Touring"],
    "CR-V": ["LX", "EX", "Touring"],
    Focus: ["S", "SE", "Titanium"],
    "F-150": ["XL", "XLT", "Lariat"],
    Mustang: ["EcoBoost", "GT", "Bullitt"],
    X5: ["xDrive40i", "xDrive50i", "M"],
    X3: ["sDrive30i", "xDrive30i", "M40i"],
    "3 Series": ["330i", "M340i", "330e"]
  };

  // Car colors
export const carColors = [
    "Black", "White", "Red", "Blue", "Silver", "Gray", "Green", "Yellow", "Orange"
  ];
  
  // Interior colors
  export const interiorColors = [
    "Beige", "Black", "Gray", "Tan", "Brown", "White"
  ];


export const carTransmissions = [
    "Automatic",
    "Manual",
    "CVT",
    "Dual-Clutch",
    "Semi-Automatic"
  ];    

  // Registration status
export const registrationStatus = [
    { id: 1, name: "Yes" },
    { id: 2, name: "No" },
  ];
  
  // Exchange possibility
  export const exchangeOptions = [
    { id: 1, name: "Yes" },
    { id: 2, name: "No" },
  ];

  // Key features
export const carKeyFeatures = [
    { id: 1, name: "Navigation System" },
    { id: 2, name: "Bluetooth" },
    { id: 3, name: "Backup Camera" },
    { id: 4, name: "Sunroof" },
    { id: 5, name: "Heated Seats" },
    { id: 6, name: "Blind Spot Monitor" },
    { id: 7, name: "Apple CarPlay/Android Auto" },
  ];
  
  // Car types
  export const carTypes = [
    { id: 1, name: "Sedan" },
    { id: 2, name: "SUV" },
    { id: 3, name: "Truck" },
    { id: 4, name: "Coupe" },
    { id: 5, name: "Convertible" },
    { id: 6, name: "Hatchback" },
    { id: 7, name: "Wagon" },
  ];


  // Vehicle Body types (new dummy data)
export const vehicleBodyTypes = [
    { id: 1, name: "Sedan" },
    { id: 2, name: "SUV" },
    { id: 3, name: "Truck" },
    { id: 4, name: "Coupe" },
    { id: 5, name: "Wagon" },
    { id: 6, name: "Hatchback" },
    { id: 7, name: "Convertible" },
];

// Fuel Types (new dummy data)
export const fuelTypes = [
    { id: 1, name: "Petrol" },
    { id: 2, name: "Diesel" },
    { id: 3, name: "Electric" },
    { id: 4, name: "Hybrid" },
];

export const seatTypes = [
    { id: 1, name: "2-seater" },
    { id: 2, name: "4-seater" },
    { id: 3, name: "5-seater" },
    { id: 4, name: "6-seater" },
    { id: 5, name: "7-seater" },
    { id: 6, name: "8-seater" },
  ];
  
  // Drivetrain options
  export const driveTrains = [
    { id: 1, name: "FWD (Front-Wheel Drive)" },
    { id: 2, name: "RWD (Rear-Wheel Drive)" },
    { id: 3, name: "AWD (All-Wheel Drive)" },
    { id: 4, name: "4WD (Four-Wheel Drive)" },
  ];

  export const numCylinders = [
    { id: 1, name: "1-cylinder" },
    { id: 2, name: "2-cylinders" },
    { id: 3, name: "3-cylinders" },
    { id: 4, name: "4-cylinders" },
    { id: 5, name: "5-cylinders" },
    { id: 6, name: "6-cylinders" },
    { id: 7, name: "8-cylinders" },
    { id: 8, name: "10-cylinders" },
    { id: 9, name: "12-cylinders" },
  ];
  
  // Engine size (cc)
  export const engineSizes = [
    { id: 1, name: "1000cc" },
    { id: 2, name: "1200cc" },
    { id: 3, name: "1500cc" },
    { id: 4, name: "1600cc" },
    { id: 5, name: "2000cc" },
    { id: 6, name: "2500cc" },
    { id: 7, name: "3000cc" },
    { id: 8, name: "4000cc" },
    { id: 9, name: "5000cc" },
  ];


  export const horsePowerOptions = [
    { id: 1, name: "50 hp" },
    { id: 2, name: "75 hp" },
    { id: 3, name: "100 hp" },
    { id: 4, name: "125 hp" },
    { id: 5, name: "150 hp" },
    { id: 6, name: "175 hp" },
    { id: 7, name: "200 hp" },
    { id: 8, name: "225 hp" },
    { id: 9, name: "250 hp" },
    { id: 10, name: "300 hp" },
    { id: 11, name: "350 hp" },
    { id: 12, name: "400 hp" },
    { id: 13, name: "450 hp" },
    { id: 14, name: "500 hp" },
  ];

  export const negotiationOptions = [
    "Yes", "No"
  ];
  
  export const businessCategories = [
    "Car Dealership",
    "Car Rental",
    "Car Repairs & Service",
    "Car Accessories",
    "Car Wash & Detailing",
    "Car Parts Supplier",
    "Car Leasing",
    "Car Auction"
  ];
  