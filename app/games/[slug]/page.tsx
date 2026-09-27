import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { arcadeGames } from "../../data/arcade";
import { WorkbenchShell } from "../../components/WorkbenchShell";
import { GamePlayer } from "../../components/GamePlayer";
import { GameGallery } from "../../components/GameGallery";
import styles from "./page.module.css";

export function generateStaticParams() { return arcadeGames.map(game => ({ slug: game.id })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = arcadeGames.find(game => game.id === slug);
  if (!game) return { title: "Game not found" };
  return { title: game.title, description: game.description, alternates: { canonical: `/games/${game.id}/` } };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = arcadeGames.find(game => game.id === slug);
  if (!game) notFound();
  const index = arcadeGames.indexOf(game);
  const moreGames = [1, 2, 3].map(offset => arcadeGames[(index + offset) % arcadeGames.length]);
  return <WorkbenchShell>
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/#collection">← All games</Link><span>/</span><span>{game.title}</span></nav>
      <header className={styles.heading}>
        <div><p className="eyebrow">GOOSE GAMES / {game.genre}</p><h1>{game.title}</h1><p>{game.tagline}</p></div>
        <span className={styles.status}><i data-playable={Boolean(game.playUrl)} />{game.playUrl ? "PLAY IN YOUR BROWSER" : game.id === "daho" ? "FROM THE ARCHIVE" : "GAMEPLAY PREVIEW"}</span>
      </header>
      <div className={styles.gameLayout}>
        <div className={styles.primary}>
          <GamePlayer game={game} />
          <section className={styles.about} aria-labelledby="about-game"><p className="eyebrow">THE GAME</p><h2 id="about-game">{game.tagline}</h2><p>{game.description}</p>
            {game.embedUrl && <p className={styles.controlNote}>{game.controlsHint ?? "Use the in-game menu for controls and settings. Some games are best played with a keyboard and mouse."}</p>}
          </section>
          <GameGallery game={game} />
        </div>
        <aside className={styles.gameCard} aria-label="Game details">
          <Image src={game.cover} alt={`${game.title} illustrated cover`} width={400} height={600} className={styles.cover} priority />
          <div className={styles.cardBody}><h2>{game.title}</h2><p>By Goose Games</p>
            {game.playUrl ? <a className={styles.launch} href={game.playUrl} target="_blank" rel="noreferrer">Open game in new tab <span>↗</span></a> : <p className={styles.unavailable}>{game.id === "daho" ? "An archived project. No browser build is available yet." : "Explore the preview. A public playable build is not available yet."}</p>}
            <dl><div><dt>Genre</dt><dd>{game.genre}</dd></div><div><dt>Availability</dt><dd>{game.playUrl ? "Browser game" : "Preview / archive"}</dd></div><div><dt>Creator</dt><dd><a href="https://jakedoesdev.com" target="_blank" rel="noreferrer">Jacob Clark ↗</a></dd></div></dl>
            {game.caseStudy && <a className={styles.story} href={game.caseStudy} target="_blank" rel="noreferrer">Read the project story ↗</a>}
          </div>
        </aside>
      </div>
      <section className={styles.more} aria-labelledby="more-games"><div><p className="eyebrow">KEEP PLAYING</p><h2 id="more-games">Another cartridge?</h2><Link href="/#collection">View all {arcadeGames.length} games ↗</Link></div><div className={styles.moreGrid}>{moreGames.map(item => <Link key={item.id} href={`/games/${item.id}/`}><Image src={item.cover} alt="" width={160} height={240} /><span><small>{item.genre}</small><strong>{item.title}</strong><span>{item.playUrl ? "Play game ↗" : "View game ↗"}</span></span></Link>)}</div></section>
    </div>
  </WorkbenchShell>;
}
