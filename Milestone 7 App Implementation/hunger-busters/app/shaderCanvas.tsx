import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

// TypeScript Interface for the component props
interface ShaderCanvasProps {
  urlString?: string;
}

// Global variable to track the currently active ShaderCanvas instance
let activeShaderCanvasUnmount: (() => void) | null = null;

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({ urlString }) => {
  // Default URL if no urlString is provided
  const defaultUrl = "https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.9&cAzimuthAngle=170&cDistance=4.4&cPolarAngle=70&cameraZoom=1&color1=%2394ffd1&color2=%236bf5ff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1.4&positionX=0&positionY=0.9&positionZ=-0.3&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=2.4&uFrequency=0&uSpeed=0.2&uStrength=3&uTime=0&wireframe=false";

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // If there is an active shader instance, dismount it before mounting this one
    if (activeShaderCanvasUnmount) {
      activeShaderCanvasUnmount(); // Call the previous unmount function
    }

    // Set this instance as the active shader unmount function
    activeShaderCanvasUnmount = () => setShouldRender(false);

    // Render this instance
    setShouldRender(true);

    return () => {
      // Cleanup when this component unmounts
      if (activeShaderCanvasUnmount === activeShaderCanvasUnmount) {
        setShouldRender(false);
        activeShaderCanvasUnmount = null;
      }
    };
  }, [urlString]); // Effect re-runs if the urlString changes

  return (
    <View style={styles.container}>
      {shouldRender && (
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={styles.canvas}
        >
          <ShaderGradient control="query" urlString={urlString || defaultUrl} />
        </ShaderGradientCanvas>
      )}
    </View>
  );
};

ShaderCanvas.propTypes = {
  urlString: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    pointerEvents: "none",
    width: "100%",
    height: "100%",
  },
  canvas: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "115%",
    zIndex: -1,
    pointerEvents: "none",
  },
});

export default ShaderCanvas;
