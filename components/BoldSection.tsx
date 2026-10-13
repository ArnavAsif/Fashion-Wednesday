'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BoldSection() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bold-section__top, .bold-section__bottom',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bold-section',
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.bold-section__img, .bold-section__lottie',
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bold-section',
            start: 'top 70%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bold-section" id="bold">
      <picture className="bold-section__bg">
        <img src="/images/img_160.webp" alt="" />
      </picture>

      <div className="container">
        <div className="bold-section__top">
          <h2 className="bold-section__top-title">
            <p>
              SPACE <i><strong>(</strong>transformation<strong>)</strong></i>
            </p>
          </h2>
          <p className="bold-section__top-text">
            our pieces are built to <strong>LAST</strong>, not to be<i>REPLACED.</i>
          </p>
        </div>

        {/* Center Graffiti & Model */}
        <div className="bold-section__lottie">
          <img src="/images/img_161.webp" alt="BOLD FASHION" />
        </div>

        <picture className="bold-section__img">
          <img src="/images/img_162.webp" alt="Serotoninn Model" />
        </picture>

        {/* Garment Care Symbols */}
        <div className="bold-section__mid">
          <div className="bold-section__group">
            <span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="black" />
                <path d="M13.2545 19.2024C13.8584 19.2024 14.3479 18.7128 14.3479 18.109C14.3479 17.5051 13.8584 17.0156 13.2545 17.0156C12.6507 17.0156 12.1611 17.5051 12.1611 18.109C12.1611 18.7128 12.6507 19.2024 13.2545 19.2024Z" fill="black" />
                <path d="M17.5806 18.109C17.5806 18.7128 17.0911 19.2024 16.4872 19.2024C15.8834 19.2024 15.3939 18.7128 15.3939 18.109C15.3939 17.5051 15.8834 17.0156 16.4872 17.0156C17.0911 17.0156 17.5806 17.5051 17.5806 18.109Z" fill="black" />
                <path d="M20.9807 18.109C20.9807 18.7128 20.4912 19.2024 19.8873 19.2024C19.2835 19.2024 18.7939 18.7128 18.7939 18.109C18.7939 17.5051 19.2835 17.0156 19.8873 17.0156C20.4912 17.0156 20.9807 17.5051 20.9807 18.109Z" fill="black" />
                <path fillRule="evenodd" clipRule="evenodd" d="M10.2635 11.418H22.345V13.6488C18.1005 13.6663 14.6655 13.8512 12.2572 14.8039C10.9533 15.3198 9.90421 16.0765 9.19197 17.185C8.48372 18.2873 8.15625 19.6632 8.15625 21.3346V22.0846H23.845V9.91797H10.2635V11.418ZM12.8091 16.1988C14.9215 15.363 18.0724 15.1678 22.345 15.149V20.5846H9.68324C9.76606 19.4832 10.0365 18.6455 10.4539 17.9959C10.9573 17.2125 11.7217 16.629 12.8091 16.1988Z" fill="black" />
              </svg>
            </span>
          </div>
          <div className="bold-section__group">
            <span>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="black" />
                <path d="M15.4831 22.6693C11.8069 22.6693 8.81641 19.6788 8.81641 16.0026C8.81641 12.3264 11.8069 9.33594 15.4831 9.33594V10.9362C12.6894 10.9362 10.4166 13.209 10.4166 16.0026C10.4166 18.7962 12.6894 21.069 15.4831 21.069V22.6693Z" fill="black" />
                <path d="M23.1832 22.6693C19.507 22.6693 16.5165 19.6788 16.5165 16.0026C16.5165 12.3264 19.507 9.33594 23.1832 9.33594V10.9362C20.6619 10.9362 18.5648 12.7875 18.1799 15.2021H23.1834V16.8023H18.1798C18.5644 19.2174 20.6616 21.069 23.1832 21.069V22.6693Z" fill="black" />
              </svg>
            </span>
          </div>
        </div>

        <div className="bold-section__bottom">
          <img className="bold-section__bottom-icon" src="/images/img_163.webp" alt="" />
          <h3 className="bold-section__bottom-title">
            FREEDOM <i><strong>(</strong>creative<strong>)</strong></i>
          </h3>
          <p className="bold-section__bottom-text">
            <strong>SEROTONINN</strong> is about wearing what empowers you – what mirrors your <strong>emotions,</strong> your <strong>energy,</strong> your <strong>essence.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
