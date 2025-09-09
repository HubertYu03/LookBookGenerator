import { ScrollArea } from "../ui/scroll-area";

const LookBookDocumentaiton = () => {
  return (
    <ScrollArea className="h-[calc(100vh-160px)] w-full p-4">
      {/* Intro Quip */}
      <div>
        This is the <b>LookBook</b> editor! You can use this tool is create an
        auto-formatted PDF for your Movie/TV show cast! Below is a guide on how
        to use this tool.
      </div>

      {/* Main Functionality Explanation */}
      <div className="text-3xl font-semibold mt-5">LookBook Actions:</div>
      <div className="mt-3">
        There are multiple actions you can perform on the overall lookbook. Here
        is a guide on how each of them work.
      </div>

      <div className="text-xl mt-3 font-semibold">Saving the Lookbook</div>
      <div>
        You can save your progress of your <b>Lookbook</b> by clicking on the
        save button on the top right of the screen. You must wait for the
        success message on the top of the screen to ensure that your{" "}
        <b>LookBook</b> has been properly saved. If you close or exit the tab
        while the saving is happening, the <b>Lookbook</b> will not save
        properly. Saved Lookbooks will appear in the <b>My Lookbooks</b> page.
        You must enter a <u>project name</u> in order to save a LookBook.
      </div>

      <div className="text-xl mt-3 font-semibold">Generating LookBook</div>
      <div>
        Once you fill out all the required fields{" "}
        {"(The fields with all the red stars)"}, you would be able to generate
        the <b>LookBook</b> PDF. If try to generate a PDF and of the required
        fields are not filled out, the editor will direct you to the missing
        field.
      </div>

      <div className="text-xl mt-3 font-semibold">Sharing LookBook Link</div>
      <div>
        You can share this <b>Lookbook</b> link with others to view. They must
        have an account in order to view your <b>Lookbook</b>. To generate the
        share link, you can click on <b>More Actions</b> at the top right, and
        then click on <b>Share</b>.
      </div>

      <div className="text-xl mt-3 font-semibold">Deleting LookBook:</div>
      <div>
        You can delete a <b>LookBook</b> from the editor. To do so, you can
        click on <b>More Actions</b> at the top right of the screen. The you can
        click on <b>Delete</b> which would redirect you to your{" "}
        <b>My LookBooks</b> page.
      </div>

      {/* Roles explanation */}
      <div className="text-3xl font-semibold mt-5">Roles:</div>
      <div className="mt-3">
        Fields that include a red star <span className="text-red-500">*</span>{" "}
        indicate that the field is required for PDF generation. If you have
        created multiple roles, and one of the roles has an empty field that is
        required, the editor will automatically scroll to that Role and
        hightlight it if you attempt to generate a Lookbook.
      </div>

      <div className="text-xl mt-3 font-semibold">Adding Roles:</div>
      <div>
        In order to input more roles, you can use the <b>Add Role</b> buttons
        located under the date input as well as under all the roles towards the
        bottom of the page. Adding a Role will create an empty Role that you can
        fill out the text fields for as well as upload images.
      </div>

      <div className="text-xl mt-3 font-semibold">Scrolling to a Role:</div>
      <div>
        When creating many roles, it could get tiring to have to scroll to each
        Role individually. Using the Jump to Role functionality you can
        automaticall scroll to whatever Role you are currently looking for.
      </div>

      <div className="mt-3">
        When each Role is created, they are given a Role ID which can you find
        on the bottom right corner of their Role card. You can click on the{" "}
        <b>Jump to Role</b> selection and then choose the ID of the Role you
        want to scroll to. Once selected, the editor will automatically scroll
        to that Role.
      </div>

      <div className="text-xl mt-3 font-semibold">Clearing Fields:</div>
      <div>
        When editing a Role, you can use the <b>Clear Fields</b> button located
        on the top right of the Role card. This will clear all the text inputs
        as well as the uploaded images.
      </div>

      <div className="text-xl mt-3 font-semibold">Deleting a Role:</div>
      <div>
        When editing a your Roles, if you want to completely delete an entire
        Role card, you can use the <b>Remove Role</b> button located on the top
        right of the Role card. If you only have one Role, you will not be
        allowed to delete that role. Instead you can clear all the fields.
      </div>

      <div className="text-xl mt-3 font-semibold">Commenting on a Role:</div>
      <div>
        You can comment on specific roles by clicking on the <b>Comment </b>
        button on the Role card. Everyone who has the link to the lookbook will
        be able to comment on the Role.
      </div>

      {/* Adding margins */}
      <div className="mt-28 sm:mt-10" />
    </ScrollArea>
  );
};

export default LookBookDocumentaiton;
