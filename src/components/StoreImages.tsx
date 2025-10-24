const storeImages = [
    {
        name: 'Store 1',
        imagePath: '/images/store_1.png',
    },
    {
        name: 'Store_ 2',
        imagePath: '/images/store_2.png',
    },
    {
        name: 'Store_ 3',
        imagePath: '/images/store_3.png',
    }, 
    {
        name: 'Store_ 4',
        imagePath: '/images/store_1.png',
    },
    {
        name: 'Store_ 5',
        imagePath: '/images/store_2.png',
    },
    {
        name: 'Store_ 6',
        imagePath: '/images/store_3.png',
    }, 
    {
        name: 'Store_ 7',
        imagePath: '/images/store_1.png',
    },
    {
        name: 'Store_ 8',
        imagePath: '/images/store_2.png',
    },
]

export default function StoreImages() {
    return (
        <div>
            <section className="container mx-auto my-12 px-4">
                <h2 className="text-3xl font-medium text-[#33333D] mb-8">Фото нашего магазина</h2>
                <div className="flex overflow-x-auto pb-4 space-x-4 w-full">
                    {storeImages.map((store, index) => (
                        <div key={index} className="flex-shrink-0 w-48 h-48 sm:w-36 sm:h-36">
                            <img 
                                src={store.imagePath} 
                                alt={store.name} 
                                className="w-full h-full object-cover rounded-lg shadow-md" 
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}