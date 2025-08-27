import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/main.css';
    document.head.appendChild(link);

    const scripts = [
      '/assets/js/jquery.min.js',
      '/assets/js/jquery.scrolly.min.js',
      '/assets/js/jquery.scrollex.min.js',
      '/assets/js/skel.min.js',
      '/assets/js/util.js',
      '/assets/js/main.js'
    ];

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      for (const src of scripts) {
        await loadScript(src);
      }
    };

    loadScripts();

    return () => {
      const links = document.querySelectorAll('link[href="/assets/css/main.css"]');
      links.forEach(link => link.remove());
      
      scripts.forEach(src => {
        const scripts = document.querySelectorAll(`script[src="${src}"]`);
        scripts.forEach(script => script.remove());
      });
    };
  }, []);

 
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
    `}} />
  );
};

export default Home;