import React, { useEffect, useState } from "react";
import { nutrientLists } from "../constant";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

const NutritionSection = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [lists, setLists] = useState(nutrientLists);

    useEffect(() => {
      if (isMobile) {
        setLists(nutrientLists.slice(0, 3));
      } else {
        setLists(nutrientLists);
      }
    }, [isMobile]);
 
    useGSAP(() => {
        const titleSplit = SplitText.create(".nutrition-title", {
            type: "chars"
        });
        const paragraphSplit = SplitText.create(".nutrition-section p", {
            type: "words, lines",
            linesClass: "paragraph-line"
        });

        const contentTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".nutrition-section",
                start: "top center",
                toggleActions: "play none none reverse"
            }
        });

        contentTl.from(titleSplit.chars, {
            yPercent: 100,
            stagger: 0.02,
            ease: "power2.out",
        }).from(paragraphSplit.words, {
            yPercent: 300,
            rotate: 3,
            ease: "power1.inOut",
            duration: 1,
            stagger: 0.1
        });

        const titleTl = gsap.timeline({
            delay: 0.5,
            scrollTrigger: {
                trigger: ".nutrition-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        titleTl.to(".nutrition-text-scroll", {
            duration: 1,
            opacity: 1,
            clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
            ease: "power1.inOut"
        });
    })
  return (
    <section className="nutrition-section">
      <img
        src="/images/slider-dip.png"
        alt="dip"
        className="w-full object-cover"
        draggable={false}
      />
      <img
        src="/images/big-img.png"
        alt="big-image"
        className="big-img"
        draggable={false}
      />

      <div className="flex md:flex-row flex-col justify-between md:px-10 px-5 mt-14 md:mt-0">
        <div className="relative inline-block md:translate-y-20">
          <div className="general-title relative flex flex-col justify-center items-center">
            <div className="overflow-hidden place-self-start">
              <h1 className="nutrition-title">It still does</h1>
            </div>
            <div style={{
              clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)"
            }} className="nutrition-text-scroll place-self-start">
              <div className="bg-yellow-brown pb-5 md:pt-0 pt-3 md:px-5 px-3 inline-block">
                <h2 className="text-milk-yellow">Body Good</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:justify-center items-center translate-y-5">
          <div className="md:max-w-xs max-w-md">
            <p className="text-lg md:text-right text-balance font-paragraph">
              Milk contains a wide array of nutrients, including vitamins,
              minerals, and protein, and is lactose free
            </p>
          </div>
        </div>

        <div className="nutrition-box">
          <div className="list-wrapper">
            {lists.map((nurition, index) => (
              <div key={index} className="relative flex-1 col-center">
                <div>
                  <p className="md:text-lg font-paragraph">{nurition.label}</p>
                  <p className="font-paragraph text-sm">up to</p>
                  <p className="text-2xl tracking-tighter font-bold">{nurition.amount}</p>
                </div>
                {
                    index !== lists.length - 1 && (
                      <div className="spacer-border"/>
                    )
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionSection;
