import * as React from "react";
import { cn } from "@/lib/utils";

interface AnalogClockProps {
	/** Overall diameter in pixels */
	size?: number;
	/** Hours in 24h format (0-23) */
	hours: number;
	/** Minutes (0-59) */
	minutes: number;
	/** Seconds (0-59) */
	seconds?: number;
	/** Optional label rendered below the clock */
	label?: string;
	className?: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
	size = 120,
	hours,
	minutes,
	seconds = 0,
	label,
	className
}) => {
	const hourAngle = ((hours % 12) + minutes / 60 + (seconds ?? 0) / 3600) * 30; // 360/12
	const minuteAngle = (minutes + (seconds ?? 0) / 60) * 6; // 360/60
	const secondAngle = (seconds ?? 0) * 6; // 360/60

	const faceSize = size;
	const center = faceSize / 2;
	const tickLengthMajor = Math.max(6, Math.round(faceSize * 0.08));
	const tickLengthMinor = Math.max(4, Math.round(faceSize * 0.05));
	const tickWidthMajor = Math.max(2, Math.round(faceSize * 0.015));
	const tickWidthMinor = Math.max(1, Math.round(faceSize * 0.01));
	const hourHandLength = Math.round(faceSize * 0.28);
	const minuteHandLength = Math.round(faceSize * 0.38);
	const secondHandLength = Math.round(faceSize * 0.42);
	const centerDot = Math.max(4, Math.round(faceSize * 0.04));

	return (
		<div className={cn("flex flex-col items-center", className)}>
			<div
				className="relative rounded-full bg-card border border-border shadow-md overflow-hidden"
				style={{ width: faceSize, height: faceSize }}
			>
				{/* Subtle radial gradient */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at 30% 30%, hsl(var(--foreground) / 0.06), transparent 60%)",
					}}
				/>

				{/* Hour ticks (12) */}
				{Array.from({ length: 12 }).map((_, i) => {
					const isQuarter = i % 3 === 0;
					const length = isQuarter ? tickLengthMajor : tickLengthMinor;
					const width = isQuarter ? tickWidthMajor : tickWidthMinor;
					return (
						<div
							key={i}
							className="absolute left-1/2 top-1/2 origin-bottom"
							style={{
								width,
								height: length,
								backgroundColor: "hsl(var(--foreground) / 0.75)",
								transform: `translate(-50%, -${center - 2}px) rotate(${i * 30}deg)`,
								borderRadius: width,
							}}
						/>
					);
				})}

				{/* Hour hand */}
				<div
					className="absolute left-1/2 top-1/2 origin-bottom"
					style={{
						width: Math.max(3, Math.round(faceSize * 0.02)),
						height: hourHandLength,
						backgroundColor: "hsl(var(--foreground) / 0.9)",
						transform: `translate(-50%, -${hourHandLength - 2}px) rotate(${hourAngle}deg)`,
						borderRadius: 4,
					}}
				/>

				{/* Minute hand */}
				<div
					className="absolute left-1/2 top-1/2 origin-bottom"
					style={{
						width: Math.max(2, Math.round(faceSize * 0.015)),
						height: minuteHandLength,
						backgroundColor: "hsl(var(--foreground) / 0.7)",
						transform: `translate(-50%, -${minuteHandLength - 2}px) rotate(${minuteAngle}deg)`,
						borderRadius: 4,
					}}
				/>

				{/* Second hand */}
				<div
					className="absolute left-1/2 top-1/2 origin-bottom"
					style={{
						width: Math.max(1, Math.round(faceSize * 0.01)),
						height: secondHandLength,
						backgroundColor: "hsl(var(--destructive))",
						transform: `translate(-50%, -${secondHandLength - 2}px) rotate(${secondAngle}deg)`,
						borderRadius: 4,
					}}
				/>

				{/* Center cap */}
				<div
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
					style={{ width: centerDot, height: centerDot }}
				/>
			</div>

			{label && (
				<div className="mt-2 text-xs text-muted-foreground text-center">
					{label}
				</div>
			)}
		</div>
	);
};

export default AnalogClock;

