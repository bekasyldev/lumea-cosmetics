const socialLinks = [
    {
        name: 'Telegram',
        url: 'https://t.me/yourchannel',
        icon: '/icons/tg.svg',
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/yourprofile',
        icon: '/icons/insta.svg',
    },
    {
        name: 'WhatsApp',
        url: 'https://wa.me/7053371911',
        icon: '/icons/whatsapp.svg',
    },
]

interface FooterLink {
    name: string;
    path: string;
    iconPath?: string;
}

interface FooterSection {
    name: string;
    key: string;
    childrens: FooterLink[];
}

const footerLinks: FooterSection[] = [
    {
        name: 'Магазин',
        key: 'store',
        childrens: [
            { name: 'Контакты', path: '#contacts' },
        ]
    },
    {
        name: 'Покупателю',
        key: 'customer',
        childrens: [
            { name: 'Доставка', path: '#banner' }, 
            { name: 'Оплата', path: '#banner' },
        ]
    },
//     {
//         name: 'Каталог',
//         key: 'catalog1',
//         childrens: [
//             { 
//             name: 'Уход за кожей',
//             path: 'route/skin-care',
//             iconPath: '/icons/skin.svg',
//         },
//         { 
//             name: 'Уход за волосами',
//             path: 'route/hair-care',
//             iconPath: '/icons/hair.svg',
//         },
//         { 
//             name: 'Макияж',
//             path: 'route/makeup',
//             iconPath: '/icons/make-up.svg',
//         },
//         { 
//             name: 'Косметика',
//             path: 'route/cosmetics',
//             iconPath: '/icons/cosmetics.svg',
//         },
//         { 
//             name: 'Ароматы',
//             path: 'route/fragrances',
//             iconPath: '/icons/perfume.svg',
//         },
//     ]
//     },
//     {
//         name: 'Каталог ',
//         key: 'catalog2',
//         childrens: [
//         { 
//             name: 'Уход для полости рта',
//             path: 'route/oral-care',
//             iconPath: '/icons/mouth.svg',
//         },
//         { 
//             name: 'Гигиена',
//             path: 'route/hygiene',
//             iconPath: '/icons/hygiene.svg',
//         },
//         { 
//             name: 'Уход для полости рта',
//             path: 'route/dental-care',
//             iconPath: '/icons/mouth.svg',
//         },
//         { 
//             name: 'Наборы',
//             path: 'route/sets',
//             iconPath: '/icons/set.svg',
//         },
//     ]
// }

]

export default function Footer() {
    return (
        <footer className="py-6 sm:py-8 lg:py-10 px-4">
            <div className="container mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
                <div className="w-full lg:w-auto">
                    <h3 className='text-2xl sm:text-2xl font-bold text-[#FB6F92] mb-6 sm:mb-8'>Lumea Beauty</h3>
                    <div className='flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4'>
                        <img src="/icons/location.svg" alt="location icon" className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-base sm:text-base">Доставка по всему городу</span>
                    </div>
                    <div className='flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4'>
                        <img src="/icons/phone.svg" alt="phone icon" className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-base sm:text-base">+7(705) 337 19 11 </span>
                    </div>
                    <div className='flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6'>
                        <img src="/icons/clock.svg" alt="clock icon" className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-base sm:text-base">с 8:00 до 19:00</span>
                    </div>
                    <div className="flex space-x-3 sm:space-x-4">
                        {socialLinks.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                                <img src={link.icon} alt={`${link.name} icon`} className="w-8 h-8 sm:w-8 sm:h-8" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="hidden md:block w-full lg:w-auto lg:flex-1 lg:max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {footerLinks.map((section) => (
                            <div key={section.key}>
                                <h3 className="text-[#7E8B91] font-semibold mb-3 sm:mb-4 text-base sm:text-base">{section.name}</h3>
                                <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                                    {section.childrens.map((link) => (
                                        <li key={link.path} className="flex items-center">
                                            {link.iconPath && <img src={link.iconPath} alt={`${link.name} icon`} className="inline-block w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex-shrink-0" />}
                                            {link.iconPath ? (
                                                <span className="text-[#33333D] font-normal text-sm sm:text-sm leading-relaxed">
                                                    {link.name}
                                                </span>
                                            ) : (
                                                <a href={link.path} className="text-[#33333D] hover:text-gray-800 font-normal text-sm sm:text-sm leading-relaxed">
                                                    {link.name}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
    }
