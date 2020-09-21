const productCategories = 
[
    {
        categoryName: 'Barrier free products',
        categoryId: "CAT0000",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/barrier-free-products.jpg"
    },

    {
        categoryName: 'Bathroom products',
        categoryId: "CAT0001",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/bathroom-products.jpg"
    },

    {
        categoryName: 'Ceiling related',
        categoryId: "CAT0002",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/ceiling.jpg",
    },
    {
        categoryName: 'Construction site equipment',
        categoryId: "CAT0003",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/construction-site-equipment.jpg",
    },
    {
        categoryName: 'Décor',
        categoryId: "CAT0004",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/decor.jpeg",
    },
    {
        categoryName: 'Doors',
        categoryId: "CAT0005",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/doors.JPG",
    },

    {
        categoryName: 'Electricals',
        categoryId: "CAT0006",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/electricals.jpg",
    },
    {
        categoryName: 'External facades and fenestration',
        categoryId: "CAT0007",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/external-facades-and-fenestration.jpg",
    },
    {
        categoryName: 'Fences and perimeter enclosures',
        categoryId: "CAT0008",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/fences-and-perimeter-enclosures.jpg",
    },
    {
        categoryName: 'Finishing',
        categoryId: "CAT0009",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/finishing.jpg",
    },
    {
        categoryName: 'Fire prevention and safety',
        categoryId: "CAT0010",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/fire-prevention-and-safety.png",
    },
    {
        categoryName: 'Flooring',
        categoryId: "CAT0011",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/flooring.PNG",
    },
    {
        categoryName: 'Furniture',
        categoryId: "CAT0012",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/furniture.jpg",
    },
    {
        categoryName: 'Hardware and fastners',
        categoryId: "CAT0013",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/hardware-and-fastners.jpg",
    },
    {
        categoryName: 'Heating ventillation and air conditioning',
        categoryId: "CAT0014",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/heating-ventillation-and-air-conditioning.jpg",
    },
    {
        categoryName: 'Home automations',
        categoryId: "CAT0015",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/home-automation.jpg",
    },
    {
        categoryName: 'Insulation',
        categoryId: "CAT0016",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/insulation.jpg",
    },
    {
        categoryName: 'Kitchen',
        categoryId: "CAT0017",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/kitchen.jpg",
    },
    {
        categoryName: 'Lifts and escalators',
        categoryId: "CAT0018",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/lifts-and-escalators.jpg",
    },
    {
        categoryName: 'Lighting',
        categoryId: "CAT0019",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/lighting.jpg",
    },
    {
        categoryName: 'Office',
        categoryId: "CAT0020",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/office.jpg",
    },
    {
        categoryName: 'Outdoor',
        categoryId: "CAT0021",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/outdoor.jpg",
    },
    {
        categoryName: 'Partitions',
        categoryId: "CAT0022",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/partitions.jpg",
    },
    {
        categoryName: 'Plumbing',
        categoryId: "CAT0023",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/plumbing.jpg",
    },
    {
        categoryName: 'Renewable energy system',
        categoryId: "CAT0024",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/renewable-energy-system.jpg",
    },
    {
        categoryName: 'Roofs',
        categoryId: "CAT0025",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/roofs.jpg",
    },
    {
        categoryName: 'Safety and security',
        categoryId: "CAT0026",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/safety-and-security.jpg",
    },
    {
        categoryName: 'Stairs',
        categoryId: "CAT0027",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/stairs.jpg",
    },
    {
        categoryName: 'Waterproofing',
        categoryId: "CAT0028",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/waterproofing.jpg",
    },
    {
        categoryName: 'Water system',
        categoryId: "CAT0029",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/water-system.jpg",
    },
    {
        categoryName: 'Wellness',
        categoryId: "CAT0030",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/wellness.jpg",
    },
    {
        categoryName: 'Windows',
        categoryId: "CAT0031",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/windows.jpg",
    },
    {
        categoryName: 'Wood',
        categoryId: "CAT0032",
        categoryImage: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/vendor-categories/wood.jpg",
    }
]

export default productCategories;