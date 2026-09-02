import { generateRPGStats } from '../utils/rpgUtils';
import '../styles/rpgCard.css';

export default function RPGCard({ contributor }) {
  const rpg = generateRPGStats(contributor);

  return (
    <div className={`rpg-card ${rpg.rarity.toLowerCase()}`} style={{ '--card-color': rpg.color }}>
      <div className="rpg-card__inner">
        <div className="rpg-card__header">
          <div className="rpg-card__rarity">{rpg.rarity}</div>
          <div className="rpg-card__level">LVL {rpg.level}</div>
        </div>

        <div className="rpg-card__portrait">
          <img src={contributor.avatarUrl} alt={contributor.login} />
          <div className="rpg-card__portrait-overlay"></div>
        </div>

        <div className="rpg-card__body">
          <div className="rpg-card__name">{contributor.login}</div>
          <div className="rpg-card__class" style={{ color: rpg.color }}>{rpg.rpgClass}</div>
          <div className="rpg-card__element">{rpg.element} Affinity</div>
          
          <div className="rpg-card__stats">
            {Object.entries(rpg.stats).map(([statName, value]) => (
              <div key={statName} className="rpg-card__stat-row">
                <span className="rpg-card__stat-label">{statName}</span>
                <div className="rpg-card__stat-bar-bg">
                  <div 
                    className="rpg-card__stat-bar-fill" 
                    style={{ width: `${value}%`, background: rpg.color }}
                  ></div>
                </div>
                <span className="rpg-card__stat-val">{value}</span>
              </div>
            ))}
          </div>

          <div className="rpg-card__commits">
            <strong>{contributor.contributions}</strong> Commits
          </div>
        </div>
      </div>
    </div>
  );
}
