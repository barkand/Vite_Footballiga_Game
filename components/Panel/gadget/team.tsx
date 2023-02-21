import React from "react";
import _debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

import { StatusTypeEnum, EditTypeEnum } from "../../../../core/constant";
import { PublicContext } from "../../../../core/context";
import { importPhoto, PostAuthApi } from "../../../../core/libs";
import {
  GridHeader,
  GridItem,
  Avatar,
  Textbox,
  Tip,
} from "../../../../core/components";
import {
  CheckCircleIcon,
  CancelIcon,
  TeamLogoIcon,
} from "../../../../core/icon";

export default function Team({ name, setName, setLogo }: any) {
  const { publicCtx, setPublicCtx }: any = React.useContext(PublicContext);
  const { t } = useTranslation(["admin", "game"]);
  const debounceFn = React.useCallback(_debounce(handleDebounceFn, 1000), []);
  const [image, setImage] = React.useState<string>("");
  const [editUsername, setEditUsername] = React.useState(EditTypeEnum.None);

  React.useEffect(() => {
    if (name !== "") {
      let _image = `${import.meta.env.VITE_SERVER_PATH}/${
        import.meta.env.VITE_UPLOAD_FOLDER
      }/teams/${publicCtx.user.user_id}.webp`;

      setImage(_image);
      setLogo("ok");
    }
  }, [name]);

  const handleName = (event: any) => {
    debounceFn(event.target.value);
    setEditUsername(EditTypeEnum.None);
  };

  const imageRef: any = React.useRef();
  const openFileDialog = () => imageRef.current.click();

  async function handleDebounceFn(inputValue: any) {
    let _inputValue = inputValue.trim();
    if (_inputValue === "") return;

    setName(inputValue);
    let _result: any = await PostAuthApi(
      { name: _inputValue },
      "game/check-team"
    );

    switch (_result.code) {
      case 200:
        setEditUsername(EditTypeEnum.Edited);
        break;
      case 300:
        setEditUsername(EditTypeEnum.Error);
        break;
      default:
        setEditUsername(EditTypeEnum.None);
        break;
    }
  }

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const { formData, resize, status }: any = await importPhoto(files);
    if (status === false) {
      setPublicCtx({
        ...publicCtx,
        alert: {
          open: true,
          message: t("image-size-error"),
          severity: StatusTypeEnum.Error,
        },
      });
      return;
    }
    setLogo(formData);
    setImage(URL.createObjectURL(resize));
  };

  return (
    <>
      <GridHeader rowSpacing={5} direction="column" textAlign="center">
        <GridItem xs={12} sx={{ mt: 1 }}>
          <Avatar
            img={image}
            sx={{ width: "20vh", height: "20vh", cursor: "pointer" }}
            onClick={openFileDialog}
          >
            {image === "" && (
              <Tip title={t("team-logo", { ns: "game" })}>
                <TeamLogoIcon
                  sx={{ width: "auto", height: "90%" }}
                  color="primary"
                />
              </Tip>
            )}
          </Avatar>
        </GridItem>
        <GridItem xs={12}>
          <div style={{ direction: "ltr" }}>
            <Textbox
              autoComplete="off"
              sx={{ width: "20ch" }}
              onChange={handleName}
              placeholder={t("team-name", { ns: "game" })}
              label={name}
            />
            {editUsername === EditTypeEnum.Edited ? (
              <CheckCircleIcon color="primary" />
            ) : editUsername === EditTypeEnum.Error ? (
              <Tip title={t("team-name-already-exist", { ns: "game" })}>
                <CancelIcon color="primary" />
              </Tip>
            ) : (
              <></>
            )}
          </div>
        </GridItem>
      </GridHeader>

      <input
        type="file"
        ref={imageRef}
        style={{ display: "none" }}
        accept="image/jpeg, image/png"
        onChange={handleAddPhoto}
      />
    </>
  );
}
