# Cloud Images Update Documentation

## Overview
This document tracks the updates made to cloud images in the weather calculations application.

## Updated Local Cloud Images

All cloud images have been updated with high-quality, real photographs from Wikimedia Commons. The following images were replaced:

### 1. Cumulus Clouds (cumulus-clouds.jpg)
- **Type**: Fair weather puffy white clouds  
- **Original Source**: Wikimedia Commons - Featured Picture
- **Description**: Cumulus clouds as seen from an airplane
- **License**: CC BY-SA 3.0

### 2. Cumulonimbus Clouds (cumulonimbus-clouds.jpg)
- **Type**: Dangerous thunderstorm clouds with anvil shape
- **Original Source**: Wikimedia Commons  
- **Description**: Big Cumulonimbus with large anvil
- **License**: CC BY-SA 3.0

### 3. Stratus Clouds (stratus-clouds.jpg)
- **Type**: Low, flat gray layer clouds
- **Original Source**: Wikimedia Commons
- **Description**: Large Stratocumulus stratiformis perlucidus
- **License**: CC BY-SA 3.0/GFDL

### 4. Cirrus Clouds (cirrus-clouds.jpg)
- **Type**: High wispy ice crystal clouds
- **Status**: Using existing image (temporary)
- **Note**: Need to find a suitable high-quality replacement

### 5. Storm Clouds (storm-clouds.jpg)
- **Type**: Severe weather/supercell clouds
- **Original Source**: Wikipedia
- **Description**: Heavy rainy clouds/supercell
- **License**: CC BY-SA 3.0

## External Cloud Image URLs

The following external URLs are used in WeatherCalculations.tsx for various cloud types:

### Medium Level Clouds (2000-6000m)
- Altocumulus: `https://www.weather.gov/media/jetstream/clouds/altocumulus.jpg`
- Altostratus: `https://www.weather.gov/media/jetstream/clouds/altostratus.jpg`

### High Level Clouds (6000-12000m)  
- Cirrocumulus: `https://www.weather.gov/media/jetstream/clouds/cirrocumulus.jpg`
- Cirrostratus: `https://www.weather.gov/media/jetstream/clouds/cirrostratus.jpg`

### Special Formation Clouds
- Mammatus: `https://www.weather.gov/media/jetstream/clouds/mammatus.jpg`
- Wall Cloud: `https://www.weather.gov/media/jetstream/clouds/wallcloud.jpg`
- Shelf Cloud: `https://www.weather.gov/media/jetstream/clouds/shelfcloud.jpg`
- Lenticular: `https://www.cloudman.com/gallery/pix/len1_420.jpg`

## Notes
- All local images have been backed up with `-old` suffix
- External URLs from weather.gov are official NOAA resources
- Images include proper alt text for accessibility
- Error handling implemented for failed image loads

## Future Considerations
1. Consider downloading and hosting all external images locally for better reliability
2. Optimize image sizes for web performance
3. Add WebP format alternatives for modern browsers
4. Implement lazy loading for better initial page load