import {
  Accordion,
  AccordionItem,
  ContainedList,
  ContainedListItem,
  IconButton,
  Select,
  SelectItem,
  Tile,
} from "@carbon/react";
import { useData } from "../../../utils/use-data";
import { WidgetProps } from "../index";
import styles from "./../style.module.scss";
import { Add, TrashCan } from "@carbon/icons-react";
import { WidgetHeader } from "../../widget-header";
import { useCallback, useRef, useState } from "react";
import { Module as ModuleT, ModulesPayload } from "../../../state/widget-state";

export const Module = (props: WidgetProps<ModulesPayload>) => {
  const [allModules] = useData<Array<ModuleT>>("modules");
  const upstreamPayload = props.payload ?? [];

  const [moduleIds, setModuleIds] = useState(upstreamPayload);
  const selectRef = useRef<HTMLSelectElement>(null);

  const modules = allModules?.filter(w => moduleIds.includes(w.moduleId)) ?? [];

  const deleteModule = useCallback(
    async (id: number) => {
      const newModules = moduleIds.filter(moduleId => moduleId !== id);
      setModuleIds(newModules);
    },
    [moduleIds]
  );

  const addModule = useCallback(async () => {
    if (!selectRef.current?.value) return;
    const newModules = [...moduleIds, parseInt(selectRef.current.value, 10)];
    selectRef.current.value = "placeholder-item";
    setModuleIds(newModules);
  }, [moduleIds]);

  const onSave = useCallback(() => {
    props.requestUpdate(
      props.widgetId,
      moduleIds,
      props.index,
      props.widgetType
    );
  }, [moduleIds]);

  const onDiscard = useCallback(() => {
    if (props.widgetId < 0) {
      props.requestDelete(props.widgetId);
    } else {
      setModuleIds(upstreamPayload);
      props.requestEdit(props.widgetId, false);
    }
  }, [upstreamPayload]);

  const onMove = useCallback(
    (direction: "up" | "down") => {
      props.requestMove(props.widgetId, direction);
    },
    [props]
  );

  return (
    <div>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="Module"
          editState={props.editState}
          reorderButtonsDisabled={
            props.widgetId < 0 ? [true, true] : props.reorderButtonsDisabled
          }
          requestEdit={props.requestEdit.bind(null, props.widgetId, true)}
          requestDelete={props.requestDelete.bind(null, props.widgetId)}
          requestDiscard={onDiscard}
          requestSave={onSave}
          requestMove={onMove}
        />
      )}
      <Tile className={`${styles.widget} ${styles.moduleWidget}`}>
        <h4>Modules I'm taking this semester</h4>
        {["view", "editable"].includes(props.editState) && (
          <Accordion size="lg">
            {modules.map(m => (
              <AccordionItem title={m.name} key={m.moduleId}>
                <p>
                  {!m.description && "No description available for this module"}
                  {m.description.substring(0, 550)}
                  {m.description.length > 550 && "..."}
                </p>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {props.editState === "edit" && (
          <div className={styles.moduleWidgetAddControls}>
            <Select
              id={`module-list-${props.widgetId}`}
              size="sm"
              hideLabel
              defaultValue="placeholder-item"
              ref={selectRef}
            >
              <SelectItem
                disabled
                hidden
                value="placeholder-item"
                text="Choose a module to add"
              />
              {allModules?.map(m => (
                <SelectItem key={m.moduleId} value={m.moduleId} text={m.name} />
              ))}
            </Select>
            <IconButton size="sm" onClick={addModule} label="Add module">
              <Add size={16} />
            </IconButton>
          </div>
        )}
        {props.editState === "edit" && (
          <ContainedList kind="disclosed" label="List of modules">
            {modules.map(m => (
              <ContainedListItem
                key={m.moduleId}
                action={
                  <IconButton
                    kind="ghost"
                    label="Delete module"
                    onClick={deleteModule.bind(null, m.moduleId)}
                  >
                    <TrashCan size={16} />
                  </IconButton>
                }
              >
                {m.name}
              </ContainedListItem>
            ))}
          </ContainedList>
        )}
      </Tile>
    </div>
  );
};
