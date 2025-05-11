import LocationSearch from "../UI/location-item";

export default function HeroSection() {
  return (
    <section className="w-full h-[300px] md:h-[350px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] pt-[80px] md:pt-[100px] px-4">
      <div className="flex justify-center items-center mt-10">
        <h1 className="text-white text-center font-inter text-[18px] md:text-[28px] font-[500] leading-snug">
          Discover what you need
        </h1>
      </div>

      {/* Responsive Search Component */}
      <div className="mt-6 md:mt-10 px-2 md:px-0">
        <LocationSearch />
      </div>
    </section>
  );
}
