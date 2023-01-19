import React from "react";
import { useTranslation } from "react-i18next";

import { Transfer, Players, Team } from "./gadget";
import { SetTeam as ApiSetTeam, GetTeamName as ApiGetTeamName } from "./api";

import { PublicContext } from "../../../core/context";
import { StatusTypeEnum } from "../../../core/constant";
import {
  GridHeader,
  GridItem,
  ButtonCircularLoading,
  Divider,
} from "../../../core/components";

export default function Panel() {
  const { publicCtx, setPublicCtx }: any = React.useContext(PublicContext);
  const { t } = useTranslation(["game"]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [teams, setTeams] = React.useState<any>([]);
  const [name, setName] = React.useState<string>("");
  const [logo, setLogo] = React.useState<string>("");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const showMessage = (msg: string, severity: StatusTypeEnum) => {
    setPublicCtx({
      ...publicCtx,
      alert: {
        open: true,
        message: t(msg),
        severity: severity,
      },
    });
  };

  React.useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      return;
    }

    const getTeamName = async () => {
      const _result: any = await ApiGetTeamName({});
      if (_result.code === 200) {
        setName(_result.items.teamName);
      }
    };

    getTeamName();
  }, [loaded]);

  const handleButtonClick = () => {
    if (!loading) {
      if (name.trim() === "")
        showMessage("fill-team-name", StatusTypeEnum.Warning);
      if (logo === "") showMessage("set-team-logo", StatusTypeEnum.Warning);
      if (teams.length < 5) showMessage("add-team", StatusTypeEnum.Warning);
      if (name.trim() === "" || logo === "" || teams.length < 5) return;

      setSuccess(false);
      setLoading(true);

      let teams_id = teams.map((team: any) => team.id).slice(0, 5);

      const setTeam = async () => {
        const _result: any = await ApiSetTeam({
          name: name,
          logo: logo,
          teams: teams_id,
        });

        setLoading(false);
        if (_result.code === 200) {
          setSuccess(true);
          showMessage("save-team", StatusTypeEnum.Success);
        } else if (_result.code === 300) {
          setSuccess(false);
          showMessage("team-name-exist", StatusTypeEnum.Warning);
        } else {
          setSuccess(false);
        }
      };
      setTeam();
    }
  };

  return (
    <>
      <GridHeader sx={{ mt: 1, mb: 5, p: 3 }} rowSpacing={5}>
        <GridItem xl={4} lg={12}>
          <Team name={name} setName={setName} setLogo={setLogo} />
        </GridItem>

        <GridItem xl={8} lg={12}>
          <Transfer setTeams={setTeams} />
        </GridItem>

        <GridItem xs={12}>
          <Players teams={teams} />
        </GridItem>

        <Divider sx={{ mt: 6 }} />
        <GridItem xs={12}>
          <ButtonCircularLoading
            loading={loading}
            success={success}
            onClick={handleButtonClick}
          />
        </GridItem>
      </GridHeader>
    </>
  );
}
