import type { Planet, SunData } from '../types';
import {
  Card,
  CardHeader,
  List,
  ListItemStandard,
  Text,
  Title,
  Label,
  ObjectStatus,
  Icon,
  Button,
  FlexBox
} from '@ui5/webcomponents-react';

import "@ui5/webcomponents-icons/dist/temperature.js";
import "@ui5/webcomponents-icons/dist/history.js";
import "@ui5/webcomponents-icons/dist/action.js";
import "@ui5/webcomponents-icons/dist/globe.js";
import "@ui5/webcomponents-icons/dist/measure.js";
import "@ui5/webcomponents-icons/dist/legend.js";

interface Ui5DetailPanelProps {
  selectedPlanet: Planet | null;
  sunData: SunData;
  isMoonFocused: boolean;
  onToggleMoonFocus: () => void;
}

export default function Ui5DetailPanel({
  selectedPlanet,
  sunData,
  isMoonFocused,
  onToggleMoonFocus
}: Ui5DetailPanelProps) {
  const title = selectedPlanet ? selectedPlanet.name : sunData.name;
  const description = selectedPlanet ? selectedPlanet.description : sunData.description;
  const funFact = selectedPlanet ? selectedPlanet.funFact : sunData.funFact;
  const temp = selectedPlanet ? selectedPlanet.tempC : sunData.tempC;
  const diameter = selectedPlanet ? selectedPlanet.diameterKm : sunData.diameterKm;
  const imagePath = selectedPlanet ? selectedPlanet.imagePath : sunData.imagePath;

  const atmosphere = selectedPlanet ? selectedPlanet.atmosphere : sunData.atmosphere;
  const surface = selectedPlanet ? selectedPlanet.surface : sunData.surface;

  const discoveryText = selectedPlanet 
    ? (selectedPlanet.discoverer && selectedPlanet.discoveryYear !== 'Prähistorisch'
      ? `Entdeckt im Jahr ${selectedPlanet.discoveryYear} durch ${selectedPlanet.discoverer}.`
      : `Seit dem Altertum als Wandelstern bekannt. Römische Mythologie.`)
    : `Seit prähistorischen Zeiten beobachtet. Gravitatives Zentrum.`;

  const moons = selectedPlanet 
    ? [...selectedPlanet.moons].sort((a, b) => b.radiusKm - a.radiusKm).slice(0, 10)
    : [];

  return (
    <aside 
      className="w-full lg:w-[460px] flex-1 min-h-0 lg:flex-none p-4 flex flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l"
      style={{
        backgroundColor: 'var(--sapBackgroundColor, #fafafa)',
        borderColor: 'var(--sapGroup_BorderColor, #e5e5e5)',
        color: 'var(--sapTextColor, #1f2937)'
      }}
    >
      {/* Header bar with title and action button */}
      <FlexBox justifyContent="SpaceBetween" alignItems="Center" className="mb-4">
        <div>
          <Label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {selectedPlanet ? 'Planet' : 'Zentralstern'}
          </Label>
          <Title level="H2">{title}</Title>
        </div>
        {selectedPlanet && (
          <Button 
            design={isMoonFocused ? "Positive" : "Emphasized"} 
            icon="action" 
            onClick={onToggleMoonFocus}
          >
            {isMoonFocused ? "System zeigen" : "Fokussieren"}
          </Button>
        )}
      </FlexBox>

      {/* Main Card with Image and Description */}
      <Card 
        header={
          <CardHeader 
            titleText={title} 
            subtitleText={selectedPlanet ? 'Planet im Sonnensystem' : "Zentralstern"} 
          />
        }
        className="mb-4"
      >
        <FlexBox direction="Column" style={{ padding: '1rem' }}>
          <img 
            src={imagePath} 
            alt={title} 
            className="w-full rounded-md border mb-3 object-cover" 
            style={{ height: '180px', borderColor: 'var(--sapGroup_BorderColor, #e5e5e5)' }}
          />
          <Text style={{ lineHeight: '1.5', fontSize: '14px' }}>{description}</Text>
        </FlexBox>
      </Card>

      {/* Grid of Key Stats */}
      <Card header={<CardHeader titleText="Wissenschaftliche Daten" />} className="mb-4">
        <FlexBox direction="Column" style={{ padding: '1rem', gap: '0.75rem' }}>
          <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
            <Icon name="temperature" style={{ color: '#ef4444' }} />
            <Label>Temperatur:</Label>
            <ObjectStatus state="Critical" style={{ fontWeight: 'bold' }}>{temp}</ObjectStatus>
          </FlexBox>

          <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
            <Icon name="globe" style={{ color: '#3b82f6' }} />
            <Label>Durchmesser:</Label>
            <ObjectStatus state="Information" style={{ fontWeight: 'bold' }}>
              {diameter.toLocaleString('de-DE')} km
            </ObjectStatus>
          </FlexBox>

          {selectedPlanet && (
            <>
              <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
                <Icon name="measure" style={{ color: '#10b981' }} />
                <Label>Sonnenabstand:</Label>
                <ObjectStatus state="None" style={{ fontWeight: 'bold' }}>
                  {selectedPlanet.distanceFromSunAU} AE
                </ObjectStatus>
              </FlexBox>

              <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
                <Icon name="legend" style={{ color: '#f59e0b' }} />
                <Label>Umlaufzeit:</Label>
                <ObjectStatus state="None" style={{ fontWeight: 'bold' }}>
                  {selectedPlanet.orbitalPeriodDays >= 365
                    ? `${(selectedPlanet.orbitalPeriodDays / 365).toFixed(1)} Jahre`
                    : `${selectedPlanet.orbitalPeriodDays} Tage`}
                </ObjectStatus>
              </FlexBox>
            </>
          )}
        </FlexBox>
      </Card>

      {/* Cards for Atmosphere, Surface and History */}
      <Card header={<CardHeader titleText="Physikalische Eigenschaften" />} className="mb-4">
        <FlexBox direction="Column" style={{ padding: '1rem', gap: '1rem' }}>
          <div>
            <Label style={{ fontWeight: 'bold' }}>Atmosphäre:</Label>
            <Text style={{ display: 'block', fontSize: '13px', marginTop: '0.25rem' }}>{atmosphere}</Text>
          </div>
          <div>
            <Label style={{ fontWeight: 'bold' }}>Geologie & Oberfläche:</Label>
            <Text style={{ display: 'block', fontSize: '13px', marginTop: '0.25rem' }}>{surface}</Text>
          </div>
          <div>
            <Label style={{ fontWeight: 'bold' }}>Geschichte & Entdeckung:</Label>
            <Text style={{ display: 'block', fontSize: '13px', marginTop: '0.25rem' }}>{discoveryText}</Text>
          </div>
        </FlexBox>
      </Card>

      {/* Fun Fact */}
      <Card header={<CardHeader titleText="Wissenswertes" />} className="mb-4">
        <FlexBox direction="Column" style={{ padding: '1rem' }}>
          <Text style={{ fontStyle: 'italic', fontSize: '13px' }}>
            "{funFact}"
          </Text>
        </FlexBox>
      </Card>

      {/* Moons list */}
      {selectedPlanet && (
        <Card 
          header={
            <CardHeader 
              titleText={`Bekannte Monde (${selectedPlanet.totalMoonsCount})`} 
              subtitleText={moons.length > 0 ? "Top 10 nach Größe" : ""}
            />
          }
          className="flex-1 min-h-[200px]"
        >
          {moons.length > 0 ? (
            <List style={{ width: '100%' }}>
              {moons.map((moon, index) => (
                <ListItemStandard
                  key={moon.name}
                  additionalText={`${moon.radiusKm.toLocaleString('de-DE')} km Radius`}
                  description={moon.discoverer ? `${moon.discoverer} (${moon.discoveryYear || 'unbekannt'})` : undefined}
                >
                  {index + 1}. {moon.name}
                </ListItemStandard>
              ))}
            </List>
          ) : (
            <FlexBox justifyContent="Center" alignItems="Center" style={{ padding: '2rem' }}>
              <Text>Keine bekannten Monde vorhanden.</Text>
            </FlexBox>
          )}
        </Card>
      )}
    </aside>
  );
}
