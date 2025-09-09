import { ScrollArea } from "../ui/scroll-area";

const LocationBookDocumentation = () => {
  return (
    <ScrollArea className="h-[calc(100vh-160px)] w-full p-4">
      {/* Intro Quip */}
      <div>
        This is the <b>Location Book</b> editor! You can use this tool is create
        an auto-formatted PDF for your Movie/TV show locations! Below is a guide
        on how to use this tool.
      </div>

      {/* Main Functionality Explanation */}
      <div className="text-2xl font-semibold mt-5">Location Book Actions:</div>
      <div className="mt-3">
        There are multiple actions you can perform on the overall{" "}
        <b>Location Book</b>. Here is a guide on how each of them work.
      </div>

      <div className="text-xl mt-3 font-semibold">Saving the Location Book</div>
      <div>
        You can save your progress of your <b>Location Book</b> by clicking on
        the save button on the top right of the screen. You must wait for the
        success message on the top of the screen to ensure that your{" "}
        <b>Location Book</b> has been properly saved. If you close or exit the
        tab while the saving is happening, the <b>Location Book</b> will not
        save properly. Saved Location Books will appear in the{" "}
        <b>My Location Books</b> page. You must enter a <u>project name</u> in
        order to save a Location Book.
      </div>

      <div className="text-xl mt-3 font-semibold">Generating LookBook</div>
      <div>
        Once you fill out all the required fields{" "}
        {"(The fields with all the red stars)"}, you would be able to generate
        the <b>LookBook</b> PDF. If try to generate a PDF and of the required
        fields are not filled out, the editor will direct you to the missing
        field.
      </div>

      <div className="text-xl mt-3 font-semibold">
        Sharing Location Book Link
      </div>
      <div>
        You can share this <b>Lookbook</b> link with others to view. They must
        have an account in order to view your <b>Lookbook</b>. To generate the
        share link, you can click on <b>More Actions</b> at the top right, and
        then click on <b>Share</b>.
      </div>

      <div className="text-xl mt-3 font-semibold">Deleting Location Book:</div>
      <div>
        You can delete a <b>LookBook</b> from the editor. To do so, you can
        click on <b>More Actions</b> at the top right of the screen. The you can
        click on <b>Delete</b> which would redirect you to your{" "}
        <b>My Location Books</b> page.
      </div>

      {/* Locations explanation */}
      <div className="text-3xl font-semibold mt-5">Locations:</div>
      <div className="mt-3">
        Fields that include a red star <span className="text-red-500">*</span>{" "}
        indicate that the field is required for PDF generation. If you have
        created multiple Locations, and one of the Locations has an empty field
        that is required, the editor will automatically scroll to that Location
        and hightlight it if you attempt to generate a Lookbook.
      </div>

      <div className="text-xl mt-3 font-semibold">Adding Locations:</div>
      <div>
        In order to input more Locations, you can use the <b>Add Location</b>{" "}
        buttons located under the date input as well as under all the Locations
        towards the bottom of the page. Adding a Location will create an empty
        Location that you can fill out the text fields for as well as upload
        images.
      </div>

      <div className="text-xl mt-3 font-semibold">
        Scrolling to a Locations:
      </div>
      <div>
        When creating many Locations, it could get tiring to have to scroll to
        each Location individually. Using the Jump to Location functionality you
        can automaticall scroll to whatever Location you are currently looking
        for.
      </div>

      <div className="mt-3">
        When each Location is created, they are given a Location ID which can
        you find on the bottom right corner of their Location card. You can
        click on the <b>Jump to Location</b> selection and then choose the ID of
        the Location you want to scroll to. Once selected, the editor will
        automatically scroll to that Location.
      </div>

      <div className="text-xl mt-3 font-semibold">Clearing Fields:</div>
      <div>
        When editing a Location, you can use the <b>Clear Fields</b> button
        located on the top right of the Location card. This will clear all the
        text inputs as well as the uploaded images.
      </div>

      <div className="text-xl mt-3 font-semibold">Deleting a Location:</div>
      <div>
        When editing a your Locations, if you want to completely delete an
        entire Location card, you can use the <b>Remove Location</b> button
        located on the top right of the Location card. If you only have one
        Location, you will not be allowed to delete that Location. Instead you
        can clear all the fields.
      </div>

      <div className="text-xl mt-3 font-semibold">
        Commenting on a Location:
      </div>
      <div>
        You can comment on specific Locations by clicking on the <b>Comment </b>
        button on the Location card. Everyone who has the link to the lookbook
        will be able to comment on the Location.
      </div>

      {/* Adding margins */}
      <div className="mt-28 sm:mt-10" />
    </ScrollArea>
  );
};

export default LocationBookDocumentation;
