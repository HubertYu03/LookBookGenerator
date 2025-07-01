// PDF Template for new LookBook

// Importing Global Types
import type { Role } from "@/types/global";

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

// Register Font
Font.register({
  family: "Montserrat",
  src: "http://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf",
});

// Create styles
const styles = StyleSheet.create({
  coverFormat: {
    backgroundColor: "#EDE8D0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  coverContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    width: "45%",
    padding: "20px",
    fontFamily: "Montserrat",
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
  pageFormat: {
    backgroundColor: "#EDE8D0",
    padding: "20px",
    justifyContent: "space-between",

    display: "flex",
    flexDirection: "row",
  },
  sectionTitle: {
    marginBottom: "30px",
  },
  pageLeft: {
    width: "30%",
    padding: "5px",
    gap: "10px",

    borderColor: "#4F4D46",
    borderWidth: 1,
  },
  titleDescContainer: {
    display: "flex",
    gap: "3px",
  },
  descriptionText: {
    fontSize: "14px",
  },
  pageMiddle: {
    width: "55%",
    padding: "5px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    borderColor: "#4F4D46",
    borderWidth: 1,
  },
  colorPaletteImg: {
    height: "40px",
  },
  stylingImagesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "80%",
  },
  stylingEmptyImg: {
    width: "110px",
    height: "170px",
  },
  stylingImg: {
    width: "110px",
    height: "170px",
  },
});

type LookBookProps = {
  project_name: string;
  crew_name: string;
  director_name: string;
  roles: Role[];
};

// Create Document Component
const LookBook = ({
  project_name,
  crew_name,
  director_name,
  roles,
}: LookBookProps) => (
  <Document>
    {/* Title Page */}
    <Page size="A4" orientation="landscape" style={styles.coverFormat}>
      <View style={styles.coverContent}>
        <View style={styles.coverTextContainer}>
          <Text style={styles.coverTitle}>Lookbook</Text>
          <Text
            style={{
              fontSize: "28px",
            }}
          >
            {project_name}
          </Text>
        </View>

        <View style={styles.coverTextContainer}>
          <Text>{crew_name}</Text>
          <Text>{director_name}</Text>
        </View>
      </View>
    </Page>

    {roles.map((role) =>
      _.chunk(role.stylingSuggestions, 6).map((chunk, index) => (
        <Page
          size="A4"
          orientation="landscape"
          style={styles.pageFormat}
          key={role.id}
        >
          <View style={styles.pageLeft}>
            <Text>{project_name}</Text>
            <Text>{role.roleName}</Text>

            <View style={styles.titleDescContainer}>
              <Text>Suggested Wardrobe Style</Text>
              <Text style={styles.descriptionText}>{role.wardrobeStyle}</Text>
            </View>

            <View style={styles.titleDescContainer}>
              <Text>Suggested Color Palette</Text>
              {role.colorPalette && (
                <Image src={role.colorPalette} style={styles.colorPaletteImg} />
              )}
            </View>

            <View style={styles.titleDescContainer}>
              <Text>Additional Notes</Text>
              <Text style={styles.descriptionText}>{role.additionalNotes}</Text>
            </View>
          </View>

          {/* Styling Section */}
          <View style={styles.pageMiddle}>
            <Text style={styles.sectionTitle}>Styling Suggestions</Text>

            {/* Loading the images */}
            <View style={styles.stylingImagesContainer}>
              {chunk.map((style, index) => (
                <Image src={style} key={index} style={styles.stylingImg} />
              ))}
              {6 - chunk.length > 0 &&
                Array.from({ length: 6 - chunk.length }, (_, index) => (
                  <View style={styles.stylingEmptyImg}>{""}</View>
                ))}
            </View>
          </View>
          <View
            style={{
              borderColor: "#4F4D46",
              borderWidth: 1,
            }}
          >
            <Text style={styles.sectionTitle}>Accessories</Text>
          </View>
        </Page>
      ))
    )}
  </Document>
);

export default LookBook;
