import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, Line, Path, Pattern, Rect } from 'react-native-svg';

interface IslamicPatternProps {
    width?: number;
    height?: number;
    color?: string;
    opacity?: number;
    style?: StyleProp<ViewStyle>;
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({
    width = 400,
    height = 400,
    color = '#FFD700',
    opacity = 0.15,
    style
}) => {
    return (
        <Svg width={width} height={height} style={style} viewBox="0 0 400 400">
            <Defs>
                <Pattern id="islamicPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    {/* Star pattern */}
                    <Path
                        d="M50,10 L55,35 L80,35 L60,50 L68,75 L50,60 L32,75 L40,50 L20,35 L45,35 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        opacity={opacity}
                    />
                    {/* Geometric lines */}
                    <Line x1="0" y1="0" x2="100" y2="100" stroke={color} strokeWidth="0.5" opacity={opacity * 0.5} />
                    <Line x1="100" y1="0" x2="0" y2="100" stroke={color} strokeWidth="0.5" opacity={opacity * 0.5} />
                    <Line x1="50" y1="0" x2="50" y2="100" stroke={color} strokeWidth="0.5" opacity={opacity * 0.5} />
                    <Line x1="0" y1="50" x2="100" y2="50" stroke={color} strokeWidth="0.5" opacity={opacity * 0.5} />
                </Pattern>
            </Defs>
            <Rect width="400" height="400" fill="url(#islamicPattern)" />
        </Svg>
    );
};

export const MosqueDome: React.FC<{ color?: string; size?: number }> = ({
    color = '#FFD700',
    size = 100
}) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* Dome */}
            <Path
                d="M20,60 Q20,30 50,30 Q80,30 80,60 L80,70 L20,70 Z"
                fill={color}
                opacity={0.3}
            />
            {/* Minaret */}
            <Rect x="45" y="70" width="10" height="20" fill={color} opacity={0.4} />
            {/* Crescent */}
            <Path
                d="M48,25 Q45,20 48,15 Q52,18 48,25 Z"
                fill={color}
                opacity={0.5}
            />
        </Svg>
    );
};
