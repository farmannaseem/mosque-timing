import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

interface IslamicOrnamentProps {
    style?: StyleProp<ViewStyle>;
    size?: number;
    color?: string;
    duration?: number;
    delay?: number;
    type?: 'crescent' | 'star' | 'geometric';
}

export const IslamicOrnament: React.FC<IslamicOrnamentProps> = ({
    style,
    size = 50,
    color = '#FFD700',
    duration = 4000,
    delay = 0,
    type = 'crescent',
}) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        // Gentle rotation animation
        rotation.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(10, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                    withTiming(-10, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );

        // Gentle scale pulse
        scale.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1.1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );
    }, [delay, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    const renderOrnament = () => {
        switch (type) {
            case 'crescent':
                return (
                    <Svg width={size} height={size} viewBox="0 0 100 100">
                        <Path
                            d="M50,10 Q30,50 50,90 Q70,50 50,10 M50,20 Q60,50 50,80 Q40,50 50,20 Z"
                            fill={color}
                            opacity={0.9}
                        />
                        {/* Star next to crescent */}
                        <Path
                            d="M75,30 L77,36 L83,36 L78,40 L80,46 L75,42 L70,46 L72,40 L67,36 L73,36 Z"
                            fill={color}
                            opacity={0.9}
                        />
                    </Svg>
                );
            case 'star':
                return (
                    <Svg width={size} height={size} viewBox="0 0 100 100">
                        <G>
                            {/* 8-pointed Islamic star */}
                            <Path
                                d="M50,10 L55,40 L85,35 L60,50 L85,65 L55,60 L50,90 L45,60 L15,65 L40,50 L15,35 L45,40 Z"
                                fill={color}
                                opacity={0.9}
                            />
                            <Path
                                d="M50,25 L52,45 L72,43 L57,50 L72,57 L52,55 L50,75 L48,55 L28,57 L43,50 L28,43 L48,45 Z"
                                fill="#0A1929"
                                opacity={0.3}
                            />
                        </G>
                    </Svg>
                );
            case 'geometric':
                return (
                    <Svg width={size} height={size} viewBox="0 0 100 100">
                        {/* Islamic geometric pattern */}
                        <Path
                            d="M50,20 L70,35 L70,65 L50,80 L30,65 L30,35 Z"
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            opacity={0.9}
                        />
                        <Path
                            d="M50,30 L60,40 L60,60 L50,70 L40,60 L40,40 Z"
                            fill={color}
                            opacity={0.3}
                        />
                        <Path
                            d="M30,35 L70,35 M30,50 L70,50 M30,65 L70,65"
                            stroke={color}
                            strokeWidth="1"
                            opacity={0.5}
                        />
                        <Path
                            d="M50,20 L50,80 M35,27.5 L65,72.5 M65,27.5 L35,72.5"
                            stroke={color}
                            strokeWidth="1"
                            opacity={0.5}
                        />
                    </Svg>
                );
        }
    };

    return (
        <Animated.View style={[{ position: 'absolute' }, style, animatedStyle]}>
            {renderOrnament()}
        </Animated.View>
    );
};

// Helper function for delay
function withDelay(delay: number, animation: any) {
    'worklet';
    return withTiming(0, { duration: delay }, () => {
        return animation;
    });
}
