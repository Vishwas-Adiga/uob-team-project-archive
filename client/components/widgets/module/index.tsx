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
import { useCallback, useRef, useState } from "react";
import { patch } from "../../../utils/fetch";
import { WidgetHeader } from "../../widget-header";

interface Module {
  moduleId: number;
  name: string;
  description: string;
}

interface ModulesWidgetData {
  modules: Array<Module>;
}

export const Module = (props: WidgetProps) => {
  const [data, invalidateData] = useData<ModulesWidgetData>(
    `widgets/${props.widgetId}`
  );

  const [allModules] = useData<Array<Module>>("modules");
  const modules = data?.modules ?? [];
  const selectRef = useRef<HTMLSelectElement>(null);

  const deleteModule = useCallback(
    async (id: number) => {
      await patch(`widgets/${props.widgetId}`, {
        modules: modules
          .map(m => m.moduleId)
          .filter(moduleId => moduleId !== id),
      });
      invalidateData();
    },
    [modules]
  );

  const addModule = useCallback(async () => {
    if (!selectRef.current?.value) return;
    console.log(selectRef.current.value);
    await patch(`widgets/${props.widgetId}`, {
      modules: [...modules.map(m => m.moduleId), selectRef.current.value],
    });
    invalidateData();
  }, [modules]);

  return (
    <div>
      {props.editState !== "view" && (
        <WidgetHeader
          widgetType="Module"
          editState={props.editState}
          onRequestDiscard={() => null}
          onRequestSave={() => null}
        />
      )}
      <Tile className={`${styles.widget} ${styles.moduleWidget}`}>
        <h4>Modules I'm taking this semester</h4>
        {props.editState === "view" && (
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
                <SelectItem value={m.moduleId} text={m.name} />
              ))}
            </Select>
            <IconButton size="sm" onClick={addModule}>
              <Add size={16} />
            </IconButton>
          </div>
        )}
        {props.editState === "edit" && (
          <ContainedList kind="disclosed">
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
