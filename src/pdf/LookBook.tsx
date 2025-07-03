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

// Import Logo
import logo from "../../public/PlayletLogo.png";

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
    gap: "30px",
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
  stylingImageGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "64px",
    height: "80%",
  },
  stylingImagesRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    gap: 15,
  },
  stylingEmptyImg: {
    width: "140px",
    height: "190px",
    backgroundColor: "#C9C5B1",
  },
  stylingImg: {
    width: "140px",
    height: "190px",
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
  date: string;
  roles: Role[];
};

// Create Document Component
const LookBook = ({
  project_name,
  crew_name,
  director_name,
  date,
  roles,
}: LookBookProps) => (
  <Document>
    {/* Title Page */}
    <Page size="A4" orientation="landscape" style={styles.coverFormat}>
      <Image
        src={logo}
        style={{
          width: "100px",
          height: "100px",
        }}
      />
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
          <Text>Crew Name: {crew_name}</Text>
          <Text>Director: {director_name}</Text>
          <Text>{date}</Text>
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
              <View>
                <Text
                  style={
                    (styles.sectionTitle,
                    {
                      fontSize: "30px",
                      fontFamily: "Montserrat",
                    })
                  }
                >
                  Styling Suggestions
                </Text>
              </View>

              <View style={styles.stylingImageGrid}>
                {/* Loading the images */}
                <View style={styles.stylingImagesRow}>
                  {chunk.slice(0, 3).map((style, i) => (
                    <Image
                      src={style.src}
                      key={`row1-${i}`}
                      style={styles.stylingImg}
                    />
                  ))}
                  {Array.from(
                    { length: 3 - chunk.slice(0, 3).length },
                    (_, i) => (
                      <View
                        key={`row1-empty-${i}`}
                        style={styles.stylingEmptyImg}
                      />
                    )
                  )}
                </View>

                <View style={styles.stylingImagesRow}>
                  {chunk.slice(3, 6).map((style, i) => (
                    <Image
                      src={style.src}
                      key={`row1-${i}`}
                      style={styles.stylingImg}
                    />
                  ))}
                  {Array.from(
                    { length: 3 - chunk.slice(3, 6).length },
                    (_, i) => (
                      <View
                        key={`row1-empty-${i}`}
                        style={styles.stylingEmptyImg}
                      />
                    )
                  )}
                </View>
              </View>
            </View>

            {/* Accessory Section */}
            <View style={styles.pageRight}>
              <Text style={styles.sectionTitle}>Accessories</Text>
              <View style={styles.accessoriesImgContainer}>
                {accessoryChunks[index]?.map((accessory) => (
                  <Image
                    src={accessory.src}
                    key={accessory.id}
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
        return accessoryChunks.map((accessoryChunk, index) => {
          const stylingChunk = stylingChunks[index] || [];
          const stylingRow1 = stylingChunk.slice(0, 3);
          const stylingRow2 = stylingChunk.slice(3, 6);

          return (
            <Page
              size="A4"
              orientation="landscape"
              style={styles.pageFormat}
              key={`${role.id}-${index}`}
            >
              {/* LEFT PANEL */}
              <View style={styles.pageLeft}>
                <Text style={styles.font}>{project_name}</Text>
                <Text style={styles.font}>{role.roleName}</Text>

                <View style={styles.titleDescContainer}>
                  <Text style={styles.font}>Suggested Wardrobe Style</Text>
                  <Text style={styles.descriptionText}>
                    {role.wardrobeStyle}
                  </Text>
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

              {/* MIDDLE STYLING PANEL */}
              <View style={styles.pageMiddle}>
                <Text style={{ fontSize: "30px", fontFamily: "Montserrat" }}>
                  Styling Suggestions
                </Text>

                <View style={styles.stylingImageGrid}>
                  <View style={styles.stylingImagesRow}>
                    {stylingRow1.map((style, i) => (
                      <Image
                        src={style.src}
                        key={`styling-row1-${i}`}
                        style={styles.stylingImg}
                      />
                    ))}
                    {Array.from({ length: 3 - stylingRow1.length }, (_, i) => (
                      <View
                        key={`styling-row1-empty-${i}`}
                        style={styles.stylingEmptyImg}
                      />
                    ))}
                  </View>

                  <View style={styles.stylingImagesRow}>
                    {stylingRow2.map((style, i) => (
                      <Image
                        src={style.src}
                        key={`styling-row2-${i}`}
                        style={styles.stylingImg}
                      />
                    ))}
                    {Array.from({ length: 3 - stylingRow2.length }, (_, i) => (
                      <View
                        key={`styling-row2-empty-${i}`}
                        style={styles.stylingEmptyImg}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* RIGHT ACCESSORY PANEL */}
              <View style={styles.pageRight}>
                <Text style={styles.sectionTitle}>Accessories</Text>
                <View style={styles.accessoriesImgContainer}>
                  {accessoryChunk.map((accessory) => (
                    <Image
                      src={accessory.src}
                      key={accessory.id}
                      style={styles.accesoryImg}
                    />
                  ))}
                  {Array.from({ length: 4 - accessoryChunk.length }, (_, i) => (
                    <View
                      style={styles.accesoryEmptyImg}
                      key={`accessory-empty-${role.id}-${index}-${i}`}
                    />
                  ))}
                </View>
              </View>
            </Page>
          );
        });
      }
    })}
  </Document>
);

export default LookBook;
