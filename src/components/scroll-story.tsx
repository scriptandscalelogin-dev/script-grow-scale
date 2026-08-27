import { useEffect, useRef, useState } from "react";

export function ScrollStory() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Easing function for smooth animations
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const p = easeInOutCubic(scrollProgress);

  // Key animation points (0-1)
  const points = {
    youAppear: 0,
    prospect1Arrives: 0.12,
    conversation1: 0.2,
    proposal1: 0.28,
    week2Leak: 0.35,
    followUp1: 0.42,
    dealSigned1: 0.5,
    client1Celebrates: 0.55,
    client1Scales: 0.62,
    prospect2Arrives: 0.65,
    prospect3Arrives: 0.72,
    dealsClosing: 0.78,
    moneyFlows: 0.85,
    finalCelebration: 1.0,
  };

  // Helper to animate position based on progress
  const getProgress = (startPoint: number, endPoint: number) => {
    if (p < startPoint) return 0;
    if (p > endPoint) return 1;
    return (p - startPoint) / (endPoint - startPoint);
  };

  // YOU (Brass figure) - confident at top
  const youX = 80;
  const youY = 60;

  // Client 1 (Navy) - main journey
  const client1StartX = 520;
  const client1StartY = 80;
  const client1EndX = 120;
  const client1EndY = 100;
  const p1Arrive = getProgress(points.prospect1Arrives, points.conversation1);
  const client1X = client1StartX - p1Arrive * (client1StartX - client1EndX);
  const client1Y = client1StartY + p1Arrive * (client1EndY - client1StartY);

  // Conversation speech bubbles
  const bubbleOpacity = getProgress(points.conversation1, points.proposal1);

  // Proposal/quote
  const proposalOpacity = getProgress(points.proposal1, points.week2Leak);
  const proposalScale = 0.6 + proposalOpacity * 0.4;

  // LEAK visualization - crack appears at Week 2
  const leakOpacity = getProgress(points.week2Leak, points.followUp1);
  const leakX = 180 + Math.sin(leakOpacity * Math.PI * 4) * 20; // Vibrate slightly

  // Follow-up (you moving toward client again)
  const followUpProgress = getProgress(points.followUp1, points.dealSigned1);
  const youFollowUpX = youX + followUpProgress * 40;

  // Deal signed - handshake
  const handshakeOpacity = getProgress(points.dealSigned1, points.client1Celebrates);

  // Client celebration
  const celebrationOpacity = getProgress(points.client1Celebrates, points.client1Scales);
  const celebrationBounce = Math.sin(celebrationOpacity * Math.PI * 2) * 15;

  // Client 1 scaling - splits into many
  const scalingProgress = getProgress(points.client1Scales, points.prospect2Arrives);

  // Client 2 & 3 arriving
  const p2Arrive = getProgress(points.prospect2Arrives, points.dealsClosing);
  const p3Arrive = getProgress(points.prospect3Arrives, points.dealsClosing);

  const client2X = 520 - p2Arrive * 400;
  const client2Y = 140 + p2Arrive * 20;

  const client3X = 520 - p3Arrive * 400;
  const client3Y = 200 + p3Arrive * 20;

  // Money flowing back (loops continuously after dealsClosing)
  const moneyProgress = getProgress(points.moneyFlows, points.finalCelebration);
  const moneyLoop = (p % 0.1) / 0.1; // Repeating loop

  // Final celebration
  const finalCelebOpacity = getProgress(points.finalCelebration - 0.05, points.finalCelebration);

  // Stick figure component
  const StickFigure = ({
    x,
    y,
    color,
    celebrating,
  }: {
    x: number;
    y: number;
    color: string;
    celebrating?: boolean;
  }) => {
    const bounce = celebrating ? Math.sin(celebrationOpacity * Math.PI * 2) * 8 : 0;
    const armRaise = celebrating
      ? Math.sin(celebrationOpacity * Math.PI * 2) * 20
      : 0;

    return (
      <g>
        {/* Head */}
        <circle cx={x} cy={y + bounce} r="6" fill={color} />
        {/* Body */}
        <line x1={x} y1={y + 12 + bounce} x2={x} y2={y + 28 + bounce} stroke={color} strokeWidth="2" />
        {/* Left arm */}
        <line
          x1={x}
          y1={y + 16 + bounce}
          x2={x - 10}
          y2={y + 8 + bounce - armRaise}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right arm */}
        <line
          x1={x}
          y1={y + 16 + bounce}
          x2={x + 10}
          y2={y + 8 + bounce - armRaise}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left leg */}
        <line x1={x} y1={y + 28 + bounce} x2={x - 8} y2={y + 42 + bounce} stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Right leg */}
        <line x1={x} y1={y + 28 + bounce} x2={x + 8} y2={y + 42 + bounce} stroke={color} strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox="0 0 600 800"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        pointerEvents: "none",
      }}
      className="overflow-hidden"
    >
      {/* Background panel */}
      <rect x="0" y="0" width="600" height="800" fill="var(--surface-1)" opacity="0.85" />

      {/* YOU - Brass confident figure */}
      {p >= points.youAppear && <StickFigure x={youX} y={youY} color="#BA7517" />}

      {/* YOU ready pose - early on */}
      {p < points.prospect1Arrives && (
        <text x={youX + 20} y={youY - 15} fontSize="12" fill="var(--text-secondary)" textAnchor="start">
          Ready to close
        </text>
      )}

      {/* CLIENT 1 - Navy prospect arriving */}
      {p >= points.prospect1Arrives && (
        <StickFigure x={client1X} y={client1Y} color="#185FA5" />
      )}

      {/* Conversation - speech bubbles */}
      {p >= points.conversation1 && bubbleOpacity > 0 && (
        <g opacity={bubbleOpacity}>
          {/* Your speech bubble */}
          <ellipse cx={youX + 40} cy={youY - 20} rx="35" ry="18" fill="#BA7517" opacity="0.2" />
          <text x={youX + 40} y={youY - 15} fontSize="10" fill="#BA7517" textAnchor="middle">
            pitch
          </text>

          {/* Client speech bubble */}
          <ellipse cx={client1X - 40} cy={client1Y - 20} rx="35" ry="18" fill="#185FA5" opacity="0.2" />
          <text x={client1X - 40} y={client1Y - 15} fontSize="10" fill="#185FA5" textAnchor="middle">
            interested
          </text>
        </g>
      )}

      {/* Proposal/Quote */}
      {p >= points.proposal1 && proposalOpacity > 0 && (
        <g opacity={proposalOpacity} transform={`scale(${proposalScale}) translate(${100 * (1 - proposalScale)}, ${80 * (1 - proposalScale)})`}>
          <rect x="140" y="110" width="60" height="50" fill="var(--fill-accent)" opacity="0.6" rx="4" />
          <text x="170" y="130" fontSize="11" fill="white" textAnchor="middle" fontWeight="500">
            Quote
          </text>
          <text x="170" y="145" fontSize="9" fill="white" textAnchor="middle">
            £2,100/mo
          </text>
        </g>
      )}

      {/* WEEK 2 LEAK - Crack appears */}
      {p >= points.week2Leak && leakOpacity > 0 && (
        <g opacity={leakOpacity}>
          {/* Crack lines emanating from client */}
          <line x1={client1X} y1={client1Y} x2={client1X - 40} y2={client1Y - 30} stroke="#E24B4A" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
          <line x1={client1X} y1={client1Y + 20} x2={client1X + 50} y2={client1Y + 50} stroke="#E24B4A" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
          <line x1={leakX} y1={client1Y + 10} x2={leakX + 30} y2={client1Y + 40} stroke="#E24B4A" strokeWidth="2" opacity="0.6" />

          {/* Radio silence label */}
          <text x={client1X + 60} y={client1Y + 20} fontSize="11" fill="#E24B4A" fontWeight="500">
            Week 2:
          </text>
          <text x={client1X + 60} y={client1Y + 35} fontSize="10" fill="#E24B4A">
            Radio silence
          </text>

          {/* Deal slipping away indicator */}
          <circle cx={client1X} cy={client1Y} r="20" fill="none" stroke="#E24B4A" strokeWidth="1" opacity="0.3" />
        </g>
      )}

      {/* YOU FOLLOW UP - Script & Process in action */}
      {p >= points.followUp1 && followUpProgress > 0 && (
        <g opacity={getProgress(points.followUp1, points.dealSigned1)}>
          <StickFigure x={youFollowUpX} y={youY} color="#BA7517" />

          {/* Follow-up message */}
          <text x={youFollowUpX + 30} y={youY - 20} fontSize="11" fill="#639922" fontWeight="500">
            Follow-up
          </text>
          <text x={youFollowUpX + 30} y={youY - 5} fontSize="9" fill="#639922">
            Process kicks in
          </text>

          {/* Arrow showing process */}
          <path
            d={`M ${youFollowUpX + 45} ${youY} Q ${youFollowUpX + 80} ${youY - 30} ${client1X + 20} ${client1Y - 10}`}
            fill="none"
            stroke="#639922"
            strokeWidth="2"
            opacity="0.5"
            markerEnd="url(#arrowhead)"
          />
        </g>
      )}

      {/* HANDSHAKE - Deal signed */}
      {p >= points.dealSigned1 && handshakeOpacity > 0 && (
        <g opacity={handshakeOpacity}>
          <line
            x1={youFollowUpX - 5}
            y1={youY + 16}
            x2={client1X + 5}
            y2={client1Y + 16}
            stroke="#639922"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x={(youFollowUpX + client1X) / 2} y={youY + 50} fontSize="12" fill="#639922" textAnchor="middle" fontWeight="600">
            Deal Signed
          </text>
        </g>
      )}

      {/* CLIENT 1 CELEBRATING + Goes to scale */}
      {p >= points.client1Celebrates && celebrationOpacity > 0 && (
        <g>
          <StickFigure x={client1X} y={client1Y + celebrationBounce} color="#185FA5" celebrating={true} />
          <text x={client1X - 50} y={client1Y - 50} fontSize="11" fill="#639922" fontWeight="500">
            Client closes
          </text>
          <text x={client1X - 50} y={client1Y - 35} fontSize="11" fill="#639922" fontWeight="500">
            multiple deals
          </text>
        </g>
      )}

      {/* CLIENT 1 GOES AND SCALES - multiplies into more clients */}
      {p >= points.client1Scales && scalingProgress > 0 && (
        <g opacity={scalingProgress}>
          {/* Client 1 moving to top showing they're closing deals */}
          <StickFigure x={100} y={100 - scalingProgress * 30} color="#185FA5" />

          {/* Showing expansion/growth */}
          <text x={100} y={130} fontSize="10" fill="#639922" textAnchor="middle" fontWeight="500">
            Their pipeline
          </text>
          <text x={100} y={145} fontSize="10" fill="#639922" textAnchor="middle" fontWeight="500">
            now fixed
          </text>

          {/* Success indicator */}
          <circle cx={100} cy={80} r="40" fill="none" stroke="#639922" strokeWidth="1" opacity="0.3" />
        </g>
      )}

      {/* MULTIPLE CLIENTS ARRIVING - showing scale */}
      {p >= points.prospect2Arrives && (
        <g opacity={Math.min(p2Arrive, 1)}>
          <StickFigure x={client2X} y={client2Y} color="#185FA5" />
        </g>
      )}

      {p >= points.prospect3Arrives && (
        <g opacity={Math.min(p3Arrive, 1)}>
          <StickFigure x={client3X} y={client3Y} color="#185FA5" />
        </g>
      )}

      {/* MONEY FLOWING BACK - Repeating GBP notes */}
      {p >= points.moneyFlows && moneyProgress > 0 && (
        <g opacity={Math.min(moneyProgress, 1)}>
          {/* Multiple money flows from different clients */}
          <g key="money1">
            {[0, 1, 2, 3, 4].map((i) => {
              const loopPhase = (moneyLoop + i * 0.2) % 1;
              const mx = client1X + (loopPhase * 100 - 50);
              const my = client1Y + 100 - loopPhase * 150;
              return (
                <g key={`note-1-${i}`} opacity={1 - Math.abs(loopPhase - 0.5) * 2}>
                  <rect x={mx} y={my} width="16" height="10" fill="#BA7517" rx="1" />
                  <text x={mx + 8} y={my + 7} fontSize="7" fill="white" textAnchor="middle" fontWeight="600">
                    £
                  </text>
                </g>
              );
            })}
          </g>

          {/* From client 2 */}
          {p >= points.prospect2Arrives && (
            <g key="money2">
              {[0, 1, 2, 3].map((i) => {
                const loopPhase = (moneyLoop + i * 0.25) % 1;
                const mx = client2X + (loopPhase * 80 - 40);
                const my = client2Y + 80 - loopPhase * 120;
                return (
                  <g key={`note-2-${i}`} opacity={1 - Math.abs(loopPhase - 0.5) * 2}>
                    <rect x={mx} y={my} width="16" height="10" fill="#BA7517" rx="1" />
                    <text x={mx + 8} y={my + 7} fontSize="7" fill="white" textAnchor="middle" fontWeight="600">
                      £
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* From client 3 */}
          {p >= points.prospect3Arrives && (
            <g key="money3">
              {[0, 1, 2, 3].map((i) => {
                const loopPhase = (moneyLoop + i * 0.25 + 0.125) % 1;
                const mx = client3X + (loopPhase * 80 - 40);
                const my = client3Y + 80 - loopPhase * 120;
                return (
                  <g key={`note-3-${i}`} opacity={1 - Math.abs(loopPhase - 0.5) * 2}>
                    <rect x={mx} y={my} width="16" height="10" fill="#BA7517" rx="1" />
                    <text x={mx + 8} y={my + 7} fontSize="7" fill="white" textAnchor="middle" fontWeight="600">
                      £
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Money stack at top (you) showing accumulation */}
          <text x={youX + 30} y={youY - 40} fontSize="11" fill="#BA7517" fontWeight="600">
            Recurring
          </text>
          <text x={youX + 30} y={youY - 25} fontSize="11" fill="#BA7517" fontWeight="600">
            Revenue
          </text>

          {/* Stack of notes visual */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={`stack-${i}`}
              x={youX + 40 + i * 2}
              y={youY + 10 - i * 3}
              width="20"
              height="12"
              fill="#BA7517"
              opacity={0.8 - i * 0.1}
              rx="1"
            />
          ))}
        </g>
      )}

      {/* FINAL CELEBRATION - You and multiple clients */}
      {p >= points.finalCelebration - 0.1 && finalCelebOpacity > 0 && (
        <g opacity={finalCelebOpacity}>
          {/* You celebrating */}
          <StickFigure x={youX} y={youY} color="#BA7517" celebrating={true} />

          {/* Clients also celebrating */}
          <StickFigure x={120} y={140} color="#185FA5" celebrating={true} />
          <StickFigure x={200} y={180} color="#185FA5" celebrating={true} />
          <StickFigure x={280} y={160} color="#185FA5" celebrating={true} />

          {/* Success message */}
          <text x={300} y={60} fontSize="16" fill="#639922" textAnchor="middle" fontWeight="700">
            Pipeline Fixed
          </text>
          <text x={300} y={80} fontSize="12" fill="#639922" textAnchor="middle">
            Everyone wins
          </text>
        </g>
      )}

      {/* Arrow marker for paths */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#639922" />
        </marker>
      </defs>
    </svg>
  );
}
