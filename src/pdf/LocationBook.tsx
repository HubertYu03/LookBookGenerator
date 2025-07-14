// PDF Template for new LookBook

// PDF Template for new LookBook

// Importing Global Types
import type { Location } from "@/types/global";

// Importing Dependencies
import {
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import _ from "lodash";

// Import Public
import logo from "/PlayletLogo.png";
import NotoSansCJK from "/NotoSansMonoCJKjp-Regular.otf";

// Register Font
Font.register({
  family: "Noto Sans CJK",
  src: NotoSansCJK,
});

// Create styles
const styles = StyleSheet.create({
  font: {
    fontFamily: "Noto Sans CJK",
    fontWeight: 500,
  },
  coverFormat: {
    backgroundColor: "#EDE8D0",
    display: "flex",
    alignItems: "center",
    paddingTop: "50px",
    gap: "30px",
  },
  coverContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    width: "45%",
    padding: "20px",
    fontFamily: "Noto Sans CJK",
    borderColor: "#4F4D46",
    borderWidth: 2,
  },
  coverTitle: {
    fontSize: "50px",
  },
  coverTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  projectName: {
    position: "absolute",
    top: 20,
    left: 20,
    width: "100%",
  },
  locationContainer: {
    backgroundColor: "#EDE8D0",
    padding: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  locationTextContainer: {
    padding: "10px",
    fontFamily: "Noto Sans CJK",
    fontSize: "14px",
  },
  locationText: {
    display: "flex",
    flexDirection: "row",
  },
  locationFormat: {
    height: "90%",
    width: "30%",
    backgroundColor: "#C9C5B1",
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  locationFormatEmpty: {
    height: "90%",
    width: "30%",
    backgroundColor: "#C9C5B1",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  locationImg: {
    width: "90%",
    height: "120px",
  },
  locationImgEmpty: {
    width: "90%",
    height: "120px",
    backgroundColor: "#b0ac9b",
  },
});

type LocationBookProps = {
  project_name: string;
  crew_name: string;
  director_name: string;
  date: string;
  locations: Location[][];
};

// Chinese Text Formatting
function insertSpacesForChinese(text: string): string {
  return text.replace(/([\u4e00-\u9fa5])/g, "$1 ");
}

function isMostlyChinese(text: string, threshold = 0.5): boolean {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  return chineseChars.length / text.length >= threshold;
}

function formatTextWithChineseSpacing(text: string | null): string {
  return isMostlyChinese(String(text))
    ? insertSpacesForChinese(String(text))
    : String(text);
}

const LocationBook = ({
  project_name,
  crew_name,
  director_name,
  date,
  locations,
}: LocationBookProps) => {
  return (
    <Document>
      {/* Title Page */}
      <Page size="A4" orientation="landscape" style={styles.coverFormat} wrap>
        <Image
          src={logo}
          style={{
            width: "100px",
            height: "100px",
          }}
        />
        <View style={styles.coverContent}>
          <View style={styles.coverTextContainer}>
            <Text style={styles.coverTitle}>Location Book</Text>
            <Text
              style={{
                fontSize: "28px",
              }}
            >
              {formatTextWithChineseSpacing(project_name)}
            </Text>
          </View>

          <View style={styles.coverTextContainer}>
            <Text>Crew Name: {formatTextWithChineseSpacing(crew_name)}</Text>
            <Text>Director: {formatTextWithChineseSpacing(director_name)}</Text>
            <Text>Date: {date}</Text>
          </View>
        </View>
      </Page>

      {locations.map((chunk, index) => (
        <Page
          size="A4"
          orientation="landscape"
          style={styles.locationContainer}
          key={String(`${chunk[0].id}-${index}`)}
        >
          <Text style={styles.projectName}>{project_name}</Text>
          {chunk.map((location) => (
            <View key={location.id} style={styles.locationFormat}>
              <View style={styles.locationTextContainer}>
                <View style={styles.locationText}>
                  <Text>Scenes: </Text>
                  <Text style={{ color: "red" }}>{location.scene}</Text>
                </View>
                <View style={styles.locationText}>
                  <Text>D/N: </Text>
                  <Text style={{ color: "red" }}>{location.time_of_day}</Text>
                </View>
                <View style={styles.locationText}>
                  <Text>Indoor/Outdoor: </Text>
                  <Text style={{ color: "red" }}>{location.location_type}</Text>
                </View>
                <View style={styles.locationText}>
                  <Text>Location: </Text>
                  <Text style={{ color: "red" }}>
                    {formatTextWithChineseSpacing(location.location_name)}
                  </Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                {location.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.src}
                    style={styles.locationImg}
                  />
                ))}
                {Array.from({ length: 3 - location.images.length }, (_, i) => (
                  <View
                    key={`location-empty-${i}`}
                    style={styles.locationImgEmpty}
                  />
                ))}
              </View>
            </View>
          ))}
          {Array.from({ length: 3 - chunk.length }, (_, i) => (
            <View
              key={`location-empty-${i}`}
              style={styles.locationFormatEmpty}
            />
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default LocationBook;
