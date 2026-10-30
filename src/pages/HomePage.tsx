import Banner from "../components/Banner";
import Header from "../components/Header"
import HeroSlider from "../components/HeroSlider";
import HitProducts from "../components/HitProducts";
import Contact from "../components/Contact";
import StoreImages from "../components/StoreImages";
import Footer from "../components/Footer";


const sliderData = [
  {
    id: 1,
    imageUrl: '/images/hero_slide_1.png', // Replace with your actual image path
    title: 'Косметики с оптовым цеником в Алматы',
    subtitle: 'Скидки до 50% на весь ассортимент',
    buttonText: 'КАТАЛОГ',
    buttonLink: '/catalog',
  },
  {
    id: 2,
    imageUrl: '/images/hero_slide_1.png', // Replace with your actual image path
    title: 'Новая коллекция средств для ухода',
    subtitle: 'Натуральные ингредиенты для вашей кожи',
    buttonText: 'ПОДРОБНЕЕ',
    buttonLink: '/catalog',
  },
];

const bannerData = [
  {
    title: 'Доставка по всему городу',
    description: 'Быстрая доставка по городу через Яндекс. Удобно, надёжно, вовремя.',
    iconPath: '/images/delivery.png',
  },
  {
    title: 'Минимальный заказ  от 10 000 ₸',
    description: 'Мы принимаем заказы только на сумму от 10 000 ₸',
    iconPath: '/images/cards.png',
  },
  {
    title: 'Красота и уход в одном месте',
    description: 'Тысячи проверенных средств для кожи, волос и макияжа — всё, что нужно для вашего ухода',
    iconPath: '/images/beauty.png',
  },
  {
    title: 'Оптовые цены от 30 000 ₸',
    description: 'Соберите заказ на сумму от 30 000 ₸ — и получите специальные оптовые цены',
    iconPath: '/images/discount.png',
  }
]


function HomePage() {

  return (
    <>
      <Header />
      <HeroSlider slides={sliderData} />
      <Banner data={bannerData} />
      <HitProducts />
      <Banner data={bannerData} bgColor="#FFE1EC" />
      <Contact  />
      <StoreImages />
      <Footer />
    </>
  )
}

export default HomePage
