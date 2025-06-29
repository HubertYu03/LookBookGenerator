import {
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    alignItems: "flex-start",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    objectFit: "cover",
    height: "100px",
  },
});

type LookBookProps = {
  section_one: string;
  section_two: string;
  image: string;
};

// Create Document Component
const LookBook = ({ section_one, section_two, image }: LookBookProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{section_one}</Text>
      </View>
      <View style={styles.section}>
        <Text>{section_two}</Text>
      </View>
      <Image style={styles.image} src={image} />
    </Page>
  </Document>
);

export default LookBook;
