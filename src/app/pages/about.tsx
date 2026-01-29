import { Link } from 'react-router-dom';
import { Button } from '@/app/components/button';
import { Download, Music, Calendar, Award } from 'lucide-react';
import logoGold from '@/assets/b65c8f29dae3829d7417c5d59754cec48cabc03e.png';

export function AboutPage() {
  const timeline = [
    { year: '2024', event: 'Released singles "Yee-Titi-Yee" and "Make Your Mind Dey"' },
    { year: '2023', event: 'Annual London Boat Party - Biggest event yet' },
    { year: '2022', event: 'Established as one of London\'s premier event curators' },
    { year: '2012-2024', event: 'Award-winning radio show host on Rainbow Radio International for 12+ years' },
    { year: 'Early 2010s', event: 'Pioneer of Pidgin rap style in the UK' }
  ];

  const pressQuotes = [
    {
      quote: "The PM is bringing a fresh energy to the UK underground scene.",
      source: "Mixmag"
    },
    {
      quote: "One of the most exciting new talents in UK rap and electronic music.",
      source: "DJ Mag"
    },
    {
      quote: "The Thames boat parties are legendary. A must-attend event.",
      source: "Time Out London"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Bio Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800"
              alt="The PM"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="mb-8">
              <img 
                src={logoGold} 
                alt="The PM - The Prhyme Minister" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="font-heading text-5xl mb-6">ABOUT THE PM</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Prhyme Minister (PM) is one of London's finest DJs, an award-winning radio host, rap artist, and event promoter with over a decade of influence across Afro-urban music and nightlife culture.
              </p>
              <p>
                He rose to prominence as one of the pioneers of Pidgin rap, a style that later gained widespread popularity across African and diaspora music scenes. Known for his witty lyricism and cultural storytelling, PM is currently working on his solo album, featuring the singles "Yee-Titi-Yee" and "Make Your Mind Dey."
              </p>
              <p>
                As a DJ, PM hosted an award-winning radio show on Rainbow Radio International for over 12 years, building a loyal audience across the UK and Ghana. His DJ sets are known for seamless genre blending, crowd reading, and cross-cultural appeal.
              </p>
              <p>
                Beyond music, PM is an accomplished event promoter and curator. He hosts one of London's most successful annual boat parties, bringing together diverse audiences to celebrate African and global music, culture, and nightlife.
              </p>
            </div>
            <div className="mt-8">
              <a href="#" download>
                <Button variant="primary">
                  <Download size={18} className="mr-2" />
                  Download Press Kit
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <Music size={32} className="mx-auto mb-3 text-accent" />
            <p className="text-4xl font-heading text-accent mb-2">12+</p>
            <p className="text-muted-foreground">Years on Radio</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-accent" />
            <p className="text-4xl font-heading text-accent mb-2">100+</p>
            <p className="text-muted-foreground">Events Curated</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <Award size={32} className="mx-auto mb-3 text-accent" />
            <p className="text-4xl font-heading text-accent mb-2">Pioneer</p>
            <p className="text-muted-foreground">Pidgin Rap UK</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-heading text-4xl mb-8">CAREER HIGHLIGHTS</h2>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-surface border border-border rounded-xl p-6 hover:border-accent transition-colors"
              >
                <span className="font-heading text-2xl text-accent min-w-[80px]">
                  {item.year}
                </span>
                <p className="text-lg">{item.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Press Quotes */}
        <div className="mb-20">
          <h2 className="font-heading text-4xl mb-8">PRESS</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pressQuotes.map((item, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <p className="text-lg mb-4 italic">"{item.quote}"</p>
                <p className="text-accent font-heading">— {item.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking CTA */}
        <div className="bg-accent/10 border border-accent rounded-xl p-8 text-center">
          <h2 className="font-heading text-3xl mb-4">BOOK THE PM</h2>
          <p className="text-muted-foreground mb-6">
            Available for club nights, festivals, private events and collaborations
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
