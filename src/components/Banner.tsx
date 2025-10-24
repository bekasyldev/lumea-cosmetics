interface BannerDataProps {
    title: string;
    description: string;
    iconPath: string;
}

interface BannerProps {
    data: BannerDataProps[];
    bgColor?: string;
}

export default function Banner({ data, bgColor = 'bg-[#F4F9FB]' }: BannerProps) {
    return (
        <section id="banner" className={`${bgColor} py-8 px-4 mt-8 rounded-xl`}>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                {/* Placeholder for icon - will be replaced with actual image */}
                                <div className="w-12 h-12 flex items-center justify-center">
                                    <img src={item.iconPath} alt="" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div>
                                <h3 className='text-[#33333D] font-semibold mb-1'>{item.title}</h3>
                                <p className='text-[#33333D] text-sm opacity-80'>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}