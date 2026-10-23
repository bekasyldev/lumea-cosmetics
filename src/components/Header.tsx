import { Menu } from "lucide-react";
import SearchInput from "./SearchInput";
import { headerButtons } from "../constants/index";




export default function Header() { 

    return (
        <header className='p-4'>
            <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex justify-between items-center w-full lg:w-auto">
                    <h2 className='text-2xl font-bold text-[#FB6F92] mr-3'>Lumea Beauty</h2>
                    <span className="px-3 py-2 bg-[#FB6F92] text-white rounded-full text-sm">
                        <Menu className="inline mr-1" />
                    </span>
                </div>
                
                <div className="hidden lg:flex w-full lg:flex-1 lg:mx-8">
                    <SearchInput  />
                </div>
                
                <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
                    {headerButtons.map((button, index) => (
                        <a key={index} href={button.path} className='flex flex-col items-center text-[#33333D] min-w-0'>
                            <div className="w-8 h-8 flex items-center justify-center mb-1">
                                <img src={button.iconPath} alt={button.title} className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xs text-center whitespace-nowrap">{button.title}</span>
                        </a>
                    ))}
                </div>
            </div>
            {/* <nav className='container mx-auto mt-6 overflow-hidden'>
                    <div className='lg:hidden relative'>
                        <ul className='flex gap-4 animate-scroll-infinite'>
                            {navItems.map((item, index) => (
                                <li key={`first-${index}`} className="flex-shrink-0">
                                    <span className='flex items-center group relative min-w-0 whitespace-nowrap px-2'>
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                            <img
                                                src={item.iconPath}
                                                alt={item.name}
                                                width={16}
                                                height={16}
                                                className="w-4 h-4 object-contain"
                                            />
                                        </div>
                                        <span className="ml-2 text-sm relative whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </span>
                                </li>
                            ))}
                            {navItems.map((item, index) => (
                                <li key={`second-${index}`} className="flex-shrink-0">
                                    <span className='flex items-center group relative min-w-0 whitespace-nowrap px-2'>
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                            <img
                                                src={item.iconPath}
                                                alt={item.name}
                                                width={16}
                                                height={16}
                                                className="w-4 h-4 object-contain"
                                            />
                                        </div>
                                        <span className="ml-2 text-sm relative whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='hidden lg:block'>
                        <ul className='flex flex-wrap gap-4 lg:gap-8 justify-center lg:justify-start'>
                            {navItems.map((item, index) => (
                                <li key={index} className="flex-shrink-0">
                                    <span className='flex items-center relative min-w-0'>
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                            <img
                                                src={item.iconPath}
                                                alt={item.name}
                                                width={16}
                                                height={16}
                                                className="w-4 h-4 object-contain"
                                            />
                                        </div>
                                        <span className="ml-2 text-sm relative whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav> */}
        </header>
    )
}