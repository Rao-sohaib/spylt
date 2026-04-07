import { useGSAP } from "@gsap/react";
import { flavorlists } from "../constant";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const FlavorSlider = () => {
  const sliderRef = useRef();
  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  })
  useGSAP(() => {
    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;

    if (!isTablet) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1150}px`,
          scrub: true,
          pin: true
        },
      });
  
      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1150}px`,
        ease: "power1.inOut"
      });
    }

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
      },
    });

    titleTl.to(".first-text-split", {
      xPercent: -30,
      ease: "power1.inOut" 
    }).to(".flavor-text-scroll", {
      xPercent: -22,
      ease: "power1.inOut"
    }, "<").to(".second-text-split", {
      xPercent: -10,
      ease: "power1.inOut"
    }, "<");
  })
  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {flavorlists.map((flavor) => (
          <div
            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[80vh] md:w-[50vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
            key={flavor.name}
          >
            <img
              src={`/images/${flavor.color}-bg.svg`}
              alt={flavor.color}
              draggable={false}
              className="absolute bottom-0"
            />
            <img
              src={`/images/${flavor.color}-drink.webp`}
              alt={flavor.color}
              className="drinks"
              draggable={false}
            />
            <img
              src={`/images/${flavor.color}-elements.webp`}
              alt={flavor.color}
              className="elements"
              draggable={false}
            />
            <h1>{flavor.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSlider;
