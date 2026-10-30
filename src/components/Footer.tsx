import { Instagram, MessageCircle, Send } from 'lucide-react';

const socialLinks = [
    {
        name: 'Telegram',
        url: 'https://t.me/yourchannel',
        Icon: Send,
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/yourprofile',
        Icon: Instagram,
    },
    {
        name: 'WhatsApp',
        url: 'https://wa.me/7053371911',
        Icon: MessageCircle,
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
            { name: 'Каталог', path: '/catalog' },
            { name: 'Контакты', path: '/#contacts' },
        ]
    },
    {
        name: 'Покупателю',
        key: 'customer',
        childrens: [
            { name: 'Доставка', path: '/#banner' }, 
            { name: 'Оплата', path: '/#banner' },
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
    const contacts = [
        { icon: '/icons/location.svg', text: 'Доставка по всему городу' },
        { icon: '/icons/phone.svg', text: '+7(705) 337 19 11' },
        { icon: '/icons/clock.svg', text: 'с 8:00 до 19:00' },
    ];

    return (
        <footer className="bg-[#33333D] text-white mt-12">
            <div className="container mx-auto px-4 py-10 sm:py-12 flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-0">
                <div className="w-full lg:w-auto">
                    <h3 className="text-2xl font-bold text-[#FB6F92] mb-2">Lumea Beauty</h3>
                    <p className="text-sm text-white/60 mb-6 max-w-xs">Косметика и уход для вас — с доставкой по Алматы.</p>
                    <ul className="space-y-3 mb-6">
                        {contacts.map((c) => (
                            <li key={c.icon} className="flex items-center gap-3">
                                <img src={c.icon} alt="" className="w-5 h-5 flex-shrink-0 brightness-0 invert opacity-80" />
                                <span className="text-sm text-white/90">{c.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-3">
                        {socialLinks.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.name}
                                className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center transition-colors hover:bg-[#FB6F92]"
                            >
                                <link.Icon size={20} className="text-white" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="hidden md:block w-full lg:w-auto lg:flex-1 lg:max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {footerLinks.map((section) => (
                            <div key={section.key}>
                                <h3 className="text-white font-semibold mb-4">{section.name}</h3>
                                <ul className="space-y-3">
                                    {section.childrens.map((link) => (
                                        <li key={link.name} className="flex items-center">
                                            {link.iconPath && <img src={link.iconPath} alt="" className="inline-block w-4 h-4 mr-3 flex-shrink-0 brightness-0 invert" />}
                                            <a href={link.path} className="text-sm text-white/70 hover:text-[#FB6F92] transition-colors">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-4 text-xs text-white/50 text-center sm:text-left">
                    © {new Date().getFullYear()} Lumea Beauty. Все права защищены.
                </div>
            </div>
        </footer>
    );
}
