// components/ImageGallery.tsx
import React, { useRef } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

interface ImageGalleryProps {
  images: Array<{ url: string }>;
  onIndexChange: (index: number) => void;
  enabled: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
                                                     images,
                                                     onIndexChange,
                                                     enabled,
                                                   }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    onIndexChange(index);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={enabled}
      onMomentumScrollEnd={handleScroll}
      style={{ width }}
      contentContainerStyle={{ height: width }}
    >
      {images?.map((image, index) => (
        <View key={index} style={{ width, height: width }}>
          <FastImage
            source={{ uri: image.url }}
            style={{
              width,
              height: width,
              backgroundColor: '#000',
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default React.memo(ImageGallery);
