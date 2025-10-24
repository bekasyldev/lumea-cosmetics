export default function LikeButton() {
    

    return (
        <button
            className={`p-2 rounded-full transition-colors ${liked ? 'bg-[#FB6F92] text-white' : 'bg-gray-200 text-gray-600'}`}
        >

        </button>
    );
}