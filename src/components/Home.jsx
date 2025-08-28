import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  useEffect(() => {
    // 1) Load template stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/css/main.css";
    document.head.appendChild(link);

    // 2) Load template scripts in order
    const scripts = [
      "/assets/js/jquery.min.js",
      "/assets/js/jquery.scrolly.min.js",
      "/assets/js/jquery.scrollex.min.js",
      "/assets/js/skel.min.js",
      "/assets/js/util.js",
      "/assets/js/main.js",
    ];

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = false; // keep order
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    (async () => {
      for (const src of scripts) {
        await loadScript(src);
      }
    })();

    // 3) Cleanup on unmount
    return () => {
      document
        .querySelectorAll('link[href="/assets/css/main.css"]')
        .forEach((l) => l.remove());
      scripts.forEach((src) => {
        document
          .querySelectorAll(`script[src="${src}"]`)
          .forEach((s) => s.remove());
      });
    };
  }, []);

  return (
    <div>
      {/* React header */}
      <Header />

      {/* Main landing sections from the template (no header/footer inside) */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <!-- Banner -->
            <section id="banner" class="bg-img" data-bg="image1.png">
              <div class="inner">
                <header><h1>Welcome to JanConnect!</h1></header>
              </div>
              <a href="#one" class="more">Learn More</a>
            </section>

            <!-- One -->
            <section id="one" class="wrapper post bg-img" data-bg="image2.png">
              <div class="inner">
                <article class="box">
                  <header><h2>Nibh non lobortis mus nibh</h2><p>01.01.2017</p></header>
                  <div class="content">
                    <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum...</p>
                  </div>
                  <footer><a href="#" class="button alt">Learn More</a></footer>
                </article>
              </div>
              <a href="#two" class="more">Learn More</a>
            </section>

            <!-- Two -->
            <section id="two" class="wrapper post bg-img" data-bg="image5.png">
              <div class="inner">
                <article class="box">
                  <header><h2>Mus elit a ultricies at</h2><p>12.21.2016</p></header>
                  <div class="content">
                    <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum...</p>
                  </div>
                  <footer><a href="#" class="button alt">Learn More</a></footer>
                </article>
              </div>
              <a href="#three" class="more">Learn More</a>
            </section>

            <!-- Three -->
            <section id="three" class="wrapper post bg-img" data-bg="image4.png">
              <div class="inner">
                <article class="box">
                  <header><h2>Varius a cursus aliquet</h2><p>11.11.2016</p></header>
                  <div class="content">
                    <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum...</p>
                  </div>
                  <footer><a href="#" class="button alt">Learn More</a></footer>
                </article>
              </div>
              <a href="#four" class="more">Learn More</a>
            </section>

            <!-- Four -->
            <section id="four" class="wrapper post bg-img" data-bg="image3.png">
              <div class="inner">
                <article class="box">
                  <header><h2>Luctus blandit mi lectus in nascetur</h2><p>10.30.2016</p></header>
                  <div class="content">
                    <p>Scelerisque enim mi curae erat ultricies lobortis donec velit in per cum consectetur purus a enim platea vestibulum lacinia et elit ante scelerisque vestibulum...</p>
                  </div>
                  <footer><a href="#" class="button alt">Learn More</a></footer>
                </article>
              </div>
            </section>
          `,
        }}
      />

      {/* React footer */}
      <Footer />
    </div>
  );
}
