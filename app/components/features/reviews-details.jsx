import Img from "../Image";
import Button from "../Button";

export default function ReviewsDetailsPage({ specs }) {
    return (
        <div className="flex flex-col items-center justify-center mt-5">
          {specs.reviewImg && (
            <Img 
               src={specs.reviewImg}
               alt="Review Image"
               width={158}
               height={158}
               className="object-cover"
            />
          )}
          <p className="text-[#545454] font-[500] md:text-[14px] font-inter mt-2">{specs.reviewText}</p>
          <Button 
           className="md:w-[220px] md:h-[44px] md:mt-4
            md:rounded-[8px] text-[#FFFFFF] md:text-[14px] font-[500] font-inter bg-gradient-to-r from-[#00A8DF] to-[#1031AA]">
            {specs.reviewBtn}
          </Button>
        </div>
    )
}