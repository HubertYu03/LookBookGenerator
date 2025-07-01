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
  src: "https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf",
});

// Create styles
const styles = StyleSheet.create({
  font: {
    fontFamily: "Montserrat",
  },
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
    fontFamily: "Montserrat",
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
    fontFamily: "Montserrat",
    fontSize: "14px",
  },
  pageMiddle: {
    width: "55%",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    width: "120px",
    height: "170px",
    backgroundColor: "#C9C5B1",
  },
  stylingImg: {
    width: "120px",
    height: "170px",
  },
  pageRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  accessoriesImgContainer: {
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  accesoryImg: {
    width: "100px",
    height: "100px",
  },
  accesoryEmptyImg: {
    width: "100px",
    height: "100px",
    backgroundColor: "#C9C5B1",
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

    {roles.map((role) => {
      const stylingChunks = _.chunk(role.stylingSuggestions, 6);
      const accessoryChunks = _.chunk(role.accessories, 4);

      // Render the PDF differently based on what overflow occurs
      if (stylingChunks.length > accessoryChunks.length) {
        return stylingChunks.map((chunk, index) => (
          <Page
            size="A4"
            orientation="landscape"
            style={styles.pageFormat}
            key={String(`${role.id}-${index}`)}
          >
            <View style={styles.pageLeft}>
              <Text style={styles.font}>{project_name}</Text>
              <Text style={styles.font}>{role.roleName}</Text>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Suggested Wardrobe Style</Text>
                <Text style={styles.descriptionText}>{role.wardrobeStyle}</Text>
              </View>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Suggested Color Palette</Text>
                {role.colorPalette && (
                  <Image
                    src={role.colorPalette}
                    style={styles.colorPaletteImg}
                  />
                )}
              </View>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Additional Notes</Text>
                <Text style={styles.descriptionText}>
                  {role.additionalNotes}
                </Text>
              </View>
            </View>

            {/* Styling Section */}
            <View style={styles.pageMiddle}>
              <Text
                style={
                  (styles.sectionTitle,
                  {
                    fontSize: "30px",
                  })
                }
              >
                Styling Suggestions
              </Text>

              {/* Loading the images */}
              <View style={styles.stylingImagesContainer}>
                {chunk.map((style, index) => (
                  <Image src={style} key={index} style={styles.stylingImg} />
                ))}
                {6 - chunk.length > 0 &&
                  Array.from({ length: 6 - chunk.length }, (_, i) => (
                    <View
                      style={styles.stylingEmptyImg}
                      key={String(`${role.id}-empty-${i}`)}
                    >
                      {""}
                    </View>
                  ))}
              </View>
            </View>
            <View style={styles.pageRight}>
              <Text style={styles.sectionTitle}>Accessories</Text>
              <View style={styles.accessoriesImgContainer}>
                {accessoryChunks[index]?.map((accessory) => (
                  <Image
                    src={accessory}
                    key={accessory}
                    style={styles.accesoryImg}
                  />
                ))}
                {4 - accessoryChunks[index]?.length > 0 &&
                  Array.from(
                    { length: 4 - accessoryChunks[index]?.length },
                    (_, i) => (
                      <View
                        style={styles.accesoryEmptyImg}
                        key={String(
                          `${role.id}-empty-accessories-${index}-${i}`
                        )}
                      >
                        {""}
                      </View>
                    )
                  )}
                {!accessoryChunks[index] &&
                  Array.from({ length: 4 }, (_, i) => (
                    <View
                      style={styles.accesoryEmptyImg}
                      key={String(`${role.id}-empty-accessories-${index}-${i}`)}
                    >
                      {""}
                    </View>
                  ))}
              </View>
            </View>
          </Page>
        ));
      } else {
        return accessoryChunks.map((chunk, index) => (
          <Page
            size="A4"
            orientation="landscape"
            style={styles.pageFormat}
            key={String(`${role.id}-${index}`)}
          >
            <View style={styles.pageLeft}>
              <Text style={styles.font}>{project_name}</Text>
              <Text style={styles.font}>{role.roleName}</Text>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Suggested Wardrobe Style</Text>
                <Text style={styles.descriptionText}>{role.wardrobeStyle}</Text>
              </View>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Suggested Color Palette</Text>
                {role.colorPalette && (
                  <Image
                    src={role.colorPalette}
                    style={styles.colorPaletteImg}
                  />
                )}
              </View>

              <View style={styles.titleDescContainer}>
                <Text style={styles.font}>Additional Notes</Text>
                <Text style={styles.descriptionText}>
                  {role.additionalNotes}
                </Text>
              </View>
            </View>

            {/* Styling Section */}
            <View style={styles.pageMiddle}>
              <Text
                style={
                  (styles.sectionTitle,
                  {
                    fontSize: "30px",
                  })
                }
              >
                Styling Suggestions
              </Text>

              {/* Loading the images */}
              <View style={styles.stylingImagesContainer}>
                {stylingChunks[index]?.map((style, index) => (
                  <Image src={style} key={index} style={styles.stylingImg} />
                ))}
                {6 - stylingChunks[index]?.length > 0 &&
                  Array.from(
                    { length: 6 - stylingChunks[index]?.length },
                    (_, i) => (
                      <View
                        style={styles.stylingEmptyImg}
                        key={String(`${role.id}-empty-${i}`)}
                      >
                        {""}
                      </View>
                    )
                  )}
                {!stylingChunks[index] &&
                  Array.from({ length: 6 }, (_, i) => (
                    <View
                      style={styles.stylingEmptyImg}
                      key={String(`${role.id}-empty-accessories-${index}-${i}`)}
                    >
                      {""}
                    </View>
                  ))}
              </View>
            </View>
            <View style={styles.pageRight}>
              <Text style={styles.sectionTitle}>Accessories</Text>
              <View style={styles.accessoriesImgContainer}>
                {chunk.map((accessory) => (
                  <Image
                    src={accessory}
                    key={accessory}
                    style={styles.accesoryImg}
                  />
                ))}
                {4 - chunk.length > 0 &&
                  Array.from(
                    { length: 4 - accessoryChunks[index]?.length },
                    (_, i) => (
                      <View
                        style={styles.accesoryEmptyImg}
                        key={String(
                          `${role.id}-empty-accessories-${index}-${i}`
                        )}
                      >
                        {""}
                      </View>
                    )
                  )}
              </View>
            </View>
          </Page>
        ));
      }
    })}
  </Document>
);

export default LookBook;
