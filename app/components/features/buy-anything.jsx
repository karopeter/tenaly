import Img from "../Image";

export default function BuyAnything() {
  return (
    <div className="flex justify-center mt-10 px-4">
      <div className={`
          md:w-[1138px]
          md:h-[371px]
          w-[393px]
          h-[456px]
          rounded-[8px]
          bg-no-repeat bg-center bg-cover 
          bg-[url('/buyAnythingMobile.svg')]
          md:bg-[url('/buyAnything.svg')]
        `}>

      </div>
    </div>
  );
}
