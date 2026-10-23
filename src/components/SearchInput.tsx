import { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
    onQueryChange?: (query: string) => void;
}


export default function SearchInput({ onQueryChange }: SearchInputProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        if (onQueryChange) {
            onQueryChange(event.target.value);
        }
    };
    return (
        <div className="relative w-full items-center justify-center">
            <Search className="absolute left-3 top-2 text-[#7E8B91]" />
            <input
                type="text"
                placeholder="Поиск по сайту"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-12 py-2 border border-black rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#FB6F92] font-light"
            />
        </div>
    )
}