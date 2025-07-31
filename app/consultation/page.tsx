import React from 'react';

export default function ConsultationPage() {
  return (
    <main className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Design/Build Consultation</h1>
      <p className="mb-4 text-lg">
        At Muted Studio, our dedicated team specializes in delivering high-quality 2D drawings, photorealistic 3D renders, and immersive 3D video presentations. Leveraging industry-leading tools such as <strong>Rhino3D</strong>, <strong>SketchUp</strong>, and <strong>Twinmotion</strong>, we transform concepts into compelling visual experiences that bring your vision to life.
      </p>
      <p className="mb-4 text-lg">
        Whether you require detailed technical drawings, conceptual sketches, or a full 3D video walkthrough of your project, our expertise ensures a seamless and collaborative design process from start to finish. We are committed to providing creative solutions tailored to your unique needs, helping you visualize and refine your ideas with clarity and precision.
      </p>
      <p className="mb-4 text-lg">
        If you are interested in 3D design work, architectural sketches, or 2D renderings, we encourage you to reach out to us. Our team is ready to support your project with professionalism, creativity, and technical excellence.
      </p>
      <div className="mt-8">
        <a href="/contact" className="inline-block bg-accent text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-accent/90 transition-colors duration-200">
          Get in Touch
        </a>
      </div>
    </main>
  );
} 