import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay, Parallax } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Add this CSS for the pagination bullets
const paginationStyles = `
  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 6px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: transparent;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  }
`;

const defaultDirtyBg = "/images/dirtybg.jpg";
const defaultCleanBg = "/images/cleanbg.jpg";

const defaultDirtyThumbs = [
  "/images/dirty6.jpg",
  "/images/dirtyc5.jpg",
  "/images/dirtyc2.jpg",
];

const defaultCleanThumbs = [
  "/images/cleanc1.jpg",
  "/images/cleanc2.jpg",
  "/images/cleanc3.jpg",
];

function Particles({ variant = "dust" }) {
  const items = new Array(18).fill(0);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{
            opacity: [0, 0.8, 0.2, 0.8, 0],
            y: [0, -20, 10, -10, 0],
            x: [0, 10, -5, 5, 0],
            scale: [0.8, 1, 0.9, 1.05, 0.8],
          }}
          transition={{
            duration: 8 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={
            variant === "dust"
              ? "absolute h-1 w-1 rounded-full bg-white/30 blur-[1px]"
              : "absolute h-1 w-1 rounded-full bg-white/70"
          }
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function BottomCard({ thumbs }) {
  const offsets = ["-translate-y-30", "-translate-y-15", "translate-y-3"];

  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <!-- Header -->
      <header id="header"><div class="logo">Jan Connect</div>
        <a href="#menu"><span>Menu</span></a>
      </header><!-- Nav --><nav id="mode"></nav>
      <section id="banner" class="bg-img" data-bg="image1.png"><div class="inner">
          <header><h1>Welcome to JanConnect!</h1>
          </header></div>
        <a href="#one" class="more">Learn More</a>
      </section><!-- One --><section id="one" class="wrapper post bg-img" data-bg="image2.png"><div class="inner">
          <article class="box"><header><h2>Nibh non lobortis mus nibh</h2>
              <p>01.01.2017</p>
            </header><div class="content">
              <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum. At urna condimentum sed vulputate a duis in senectus ullamcorper lacus cubilia consectetur odio proin sociosqu a parturient nam ac blandit praesent aptent. Eros dignissim mus mauris a natoque ad suspendisse nulla a urna in tincidunt tristique enim arcu litora scelerisque eros suspendisse.</p>
            </div>
            <footer><a href="" class="button alt">Learn More</a>
            </footer></article></div>
        <a href="#two" class="more">Learn More</a>
      </section><!-- Two --><section id="two" class="wrapper post bg-img" data-bg="image5.png"><div class="inner">
          <article class="box"><header><h2>Mus elit a ultricies at</h2>
              <p>12.21.2016</p>
            </header><div class="content">
              <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum. At urna condimentum sed vulputate a duis in senectus ullamcorper lacus cubilia consectetur odio proin sociosqu a parturient nam ac blandit praesent aptent. Eros dignissim mus mauris a natoque ad suspendisse nulla a urna in tincidunt tristique enim arcu litora scelerisque eros suspendisse.</p>
            </div>
            <footer><a href="" class="button alt">Learn More</a>
            </footer></article></div>
        <a href="#three" class="more">Learn More</a>
      </section><!-- Three --><section id="three" class="wrapper post bg-img" data-bg="image4.png"><div class="inner">
          <article class="box"><header><h2>Varius a cursus aliquet</h2>
              <p>11.11.2016</p>
            </header><div class="content">
              <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum. At urna condimentum sed vulputate a duis in senectus ullamcorper lacus cubilia consectetur odio proin sociosqu a parturient nam ac blandit praesent aptent. Eros dignissim mus mauris a natoque ad suspendisse nulla a urna in tincidunt tristique enim arcu litora scelerisque eros suspendisse.</p>
            </div>
            <footer><a href="" class="button alt">Learn More</a>
            </footer></article></div>
        <a href="#four" class="more">Learn More</a>
      </section><!-- Four --><section id="four" class="wrapper post bg-img" data-bg="image3.png"><div class="inner">
          <article class="box"><header><h2>Luctus blandit mi lectus in nascetur</h2>
              <p>10.30.2016</p>
            </header><div class="content">
              <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum. At urna condimentum sed vulputate a duis in senectus ullamcorper lacus cubilia consectetur odio proin sociosqu a parturient nam ac blandit praesent aptent. Eros dignissim mus mauris a natoque ad suspendisse nulla a urna in tincidunt tristique enim arcu litora scelerisque eros suspendisse.</p>
            </div>
            <footer><a href="" class="button alt">Learn More</a>
            </footer></article></div>
      </section><!-- Footer --><footer id="footer"><div class="inner">

      <button style="background-color: black; color: white;text-align:centre; padding: 10px 20px; border: 1px solid white; cursor: pointer; font-size: 16px;margin-left: 340px">Login</button>

    <button style="background-color: white; color: black; text-align:centre;padding: 10px 20px; border: 1px solid black; cursor: pointer; font-size: 16px; margin-left: 20px;">Sign Up</button>


          <ul class="icons"><li><a href="#" class="icon round fa-twitter"><span class="label">Twitter</span></a></li>
            <li><a href="#" class="icon round fa-facebook"><span class="label">Facebook</span></a></li>
            <li><a href="#" class="icon round fa-instagram"><span class="label">Instagram</span></a></li>
          </ul></div>
      </footer><div class="copyright">
     <p>All copyrights reserved 2025.</p>
    </div>
  );
};

export default Home;