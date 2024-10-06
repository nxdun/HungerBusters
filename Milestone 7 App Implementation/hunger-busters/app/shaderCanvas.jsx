import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

const ShaderCanvas = ({ urlString }) => {
  // Default URL if no urlString is provided
  const defaultUrl =
    "https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.7&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false&zoomOut=false";

  return (
    <View style={styles.container}>
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={styles.canvas}
      >
        {/* Use the provided urlString prop or fall back to the default */}
        <ShaderGradient control="query" urlString={urlString || defaultUrl} />
      </ShaderGradientCanvas>
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
    height: "100%",
    zIndex: -1,
    pointerEvents: "none",
  },
});

export default ShaderCanvas;
