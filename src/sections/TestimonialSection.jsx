import React, { useRef } from "react";
import { cards } from "../constant";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

const TestimonialSection = () => {
  const vdRef = useRef([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useGSAP(() => {
    if (!isMobile) {
      gsap.set(".testimonials-section", {
        marginTop: "-140vh",
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section .first-title", {
      xPercent: 70,
    })
      .to(
        ".testimonials-section .second-title",
        {
          xPercent: 25,
        },
        "<"
      )
      .to(
        ".testimonials-section .third-title",
        {
          xPercent: -50,
        },
        "<"
      );

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".vd-card", {
      yPercent: 150,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  });

  const handlePlay = (i) => {
    const video = vdRef.current[i];
    video.play();
  };
  const handlePause = (i) => {
    const video = vdRef.current[i];
    video.pause();
  };
  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">what's</h1>
        <h1 className="text-light-brown second-title">Everyone</h1>
        <h1 className="text-black third-title">Talking</h1>
      </div>

      <div className="pin-box">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`vd-card ${card.translation} ${card.rotation}`}
            onMouseEnter={() => handlePlay(i)}
            onMouseLeave={() => handlePause(i)}
          >
            <video
              ref={(el) => (vdRef.current[i] = el)}
              src={card.src}
              playsInline
              muted
              loop
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
 