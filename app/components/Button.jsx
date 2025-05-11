const Button = ({ className, children, ...props }) => {
   return (
     <button
       className={`rounded-[6px] px-[35px] block overflow-hidden z-[1] hover:[--scale:500] ${className ? className : ''}`}
       style={{ transition: '0.25s ease' }}
       {...props} 
     >
       {children}
     </button>
   );
 };
 
 export default Button;
 