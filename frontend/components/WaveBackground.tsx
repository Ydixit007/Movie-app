// components/WaveBackground.tsx
export function WaveBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img className="absolute bottom-0 w-full" src="./waves1.svg" />
            <img className="absolute bottom-0 w-full" src="./waves2.svg" />
        </div>
    );
}