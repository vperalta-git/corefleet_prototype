'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { useTheme } from '@/components/ThemeProvider';
import { Vehicle, VehicleStatus } from '@/lib/types';
import { getVehicles } from '@/lib/storage';
import {
  Activity,
  Battery,
  ChevronDown,
  CircleDot,
  Eye,
  Fuel,
  Gauge,
  ListFilter,
  LocateFixed,
  MapPin,
  MapPinned,
  Navigation,
  Power,
  Radio,
  Route,
  Search,
  SlidersHorizontal,
  Truck,
  UserRound,
  Wifi,
  Wrench,
  X,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type StatusFilter = 'all' | VehicleStatus;
type IgnitionFilter = 'all' | 'on' | 'off';

const statusOptions: { label: string; value: StatusFilter; icon: typeof ListFilter }[] = [
  { label: 'All', value: 'all', icon: ListFilter },
  { label: 'Active', value: 'active', icon: Activity },
  { label: 'Idle', value: 'idle', icon: CircleDot },
  { label: 'Maintenance', value: 'maintenance', icon: Wrench },
  { label: 'Offline', value: 'offline', icon: Radio },
];

const statusColors: Record<VehicleStatus, string> = {
  active: 'bg-emerald-500',
  idle: 'bg-yellow-400',
  maintenance: 'bg-orange-500',
  offline: 'bg-rose-500',
};

const statusMarkerColors: Record<VehicleStatus, string> = {
  active: '#22c55e',
  idle: '#eab308',
  maintenance: '#f97316',
  offline: '#ef4444',
};

export default function MapPage() {
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [ignitionFilter, setIgnitionFilter] = useState<IgnitionFilter>('all');
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);

  useEffect(() => {
    const allVehicles = getVehicles();
    setVehicles(allVehicles);
    if (allVehicles.length > 0) {
      setSelectedVehicle(allVehicles[0]);
    }
  }, []);

  const mapBounds = {
    minLat: 14.55,
    maxLat: 14.65,
    minLng: 120.95,
    maxLng: 121.05,
  };

  const getMapPosition = (vehicle: Vehicle) => {
    const x = ((vehicle.location.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - vehicle.location.lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return {
      x: Math.min(98, Math.max(2, x)),
      y: Math.min(64, Math.max(2, y)),
    };
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.plateNumber.toLowerCase().includes(query) ||
      vehicle.driver.toLowerCase().includes(query) ||
      vehicle.address.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesIgnition = ignitionFilter === 'all' || vehicle.ignition === ignitionFilter;

    return matchesSearch && matchesStatus && matchesIgnition;
  });

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setIgnitionFilter('all');
  };

  const detailMetrics = selectedVehicle
    ? [
        { label: 'Ignition', value: selectedVehicle.ignition === 'on' ? 'On' : 'Off', icon: Power },
        { label: 'Current Speed', value: `${selectedVehicle.speed} km/h`, icon: Gauge },
        { label: 'Heading', value: `${selectedVehicle.heading} deg`, icon: Navigation },
        { label: 'Fuel Load', value: `${selectedVehicle.fuelLoad} L / ${selectedVehicle.fuelCapacity} L`, icon: Fuel },
        { label: 'Fuel Consumption', value: `${selectedVehicle.fuelConsumption} L/100 km`, icon: Route },
      ]
    : [];
  const isDark = theme === 'dark';
  const mapBackground = isDark ? '#071426' : '#f4faff';
  const gridStroke = isDark ? '#1e4b78' : '#bae6fd';
  const mapLabelFill = isDark ? '#bae6fd' : '#075985';
  const mapSubLabelFill = isDark ? '#7dd3fc' : '#0369a1';

  return (
    <PageWrapper>
      <div className="space-y-3 sm:space-y-4">
        <div className="overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 px-4 py-4 shadow-lg shadow-sky-200/60 sm:rounded-3xl sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-inner sm:size-12">
                <MapPinned size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-100">Tracking</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Live Map</h1>
                <p className="mt-1 text-sm font-semibold text-sky-100">Real-time vehicle tracking, search, and status filters.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:w-[360px]">
              <div className="rounded-2xl border border-white/25 bg-white/95 p-2.5 shadow-sm sm:p-3">
                <div className="mb-1 flex items-center gap-2 text-sky-700">
                  <ListFilter size={15} />
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]">Shown</p>
                </div>
                <p className="text-lg font-black text-blue-950 sm:text-xl">{filteredVehicles.length}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/95 p-2.5 shadow-sm sm:p-3">
                <div className="mb-1 flex items-center gap-2 text-blue-700">
                  <Navigation size={15} />
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]">Moving</p>
                </div>
                <p className="text-lg font-black text-blue-950 sm:text-xl">{vehicles.filter((vehicle) => vehicle.speed > 0).length}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/95 p-2.5 shadow-sm sm:p-3">
                <div className="mb-1 flex items-center gap-2 text-cyan-700">
                  <Wifi size={15} />
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.14em]">Online</p>
                </div>
                <p className="text-lg font-black text-blue-950 sm:text-xl">{vehicles.filter((vehicle) => vehicle.status !== 'offline').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:h-[calc(100vh-230px)] xl:min-h-[560px] xl:grid-cols-[minmax(250px,300px)_minmax(520px,1fr)_minmax(280px,330px)]">
          <div className="flex min-h-0 flex-col rounded-2xl border border-sky-200 bg-white shadow-md shadow-sky-100/70 dark:border-sky-900/70 dark:bg-slate-950 sm:rounded-3xl">
            <div className="border-b border-sky-100 bg-gradient-to-b from-sky-50 to-white p-3 dark:border-sky-900/70 dark:from-slate-900 dark:to-slate-950 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Fleet</p>
                    <h2 className="mt-1 text-xl font-black text-blue-950 dark:text-sky-50">Select Vehicle</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-sky-100 bg-sky-50 p-2 text-sky-700 transition hover:bg-sky-100 hover:text-blue-800 dark:border-sky-900 dark:bg-slate-900 dark:text-sky-200 dark:hover:bg-slate-800"
                  title="Clear filters"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 sm:space-y-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search plate, driver, place"
                    className="w-full rounded-2xl border border-sky-200 bg-white py-3 pl-10 pr-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-sky-900 dark:bg-slate-900 dark:text-sky-50 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicle-status-filter"
                    className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700"
                  >
                    <SlidersHorizontal size={14} />
                    Status
                  </label>
                  <div className="relative">
                    <ListFilter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                    <select
                      id="vehicle-status-filter"
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                      className="w-full appearance-none rounded-2xl border border-sky-200 bg-white py-3 pl-10 pr-10 text-sm font-black text-blue-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-sky-900 dark:bg-slate-900 dark:text-sky-50"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="hidden">
                      ▼
                    </span>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sky-500" size={16} />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                    <Power size={14} />
                    Ignition
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['all', 'on', 'off'] as IgnitionFilter[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setIgnitionFilter(option)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black capitalize transition ${
                          ignitionFilter === option
                            ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-500/10 dark:bg-cyan-950/50 dark:text-cyan-200'
                            : 'border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-blue-700 dark:border-sky-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-200'
                        }`}
                      >
                        {option !== 'all' && <Power size={12} />}
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-sky-100 pt-3 text-sm sm:mt-5 sm:pt-4">
                <p className="flex items-center gap-2 font-black text-blue-950 dark:text-sky-50"><LocateFixed size={15} className="text-blue-600 dark:text-sky-300" />{filteredVehicles.length} shown</p>
                <p className="font-semibold text-slate-500">{vehicles.length} total</p>
              </div>
            </div>

            <div className="max-h-[420px] min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4 sm:pt-3 xl:max-h-none">
              {filteredVehicles.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;

                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleSelectVehicle(vehicle)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-cyan-300 bg-gradient-to-r from-cyan-50 to-sky-100 shadow-sm shadow-cyan-500/15 dark:from-blue-950 dark:to-slate-900'
                        : 'border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50 dark:border-sky-900/70 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`grid size-6 shrink-0 place-items-center rounded-full ${statusColors[vehicle.status]} text-white shadow-sm`}>
                            <Truck size={13} />
                          </span>
                          <p className="truncate font-black text-blue-950 dark:text-sky-50">{vehicle.name}</p>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-blue-700">
                          <Radio size={12} />
                          {vehicle.plateNumber}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-semibold text-slate-500">
                          <UserRound size={12} className="shrink-0 text-sky-500" />
                          <span className="truncate">{vehicle.driver} - {vehicle.address}</span>
                        </p>
                      </div>
                      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-center text-blue-800 dark:bg-blue-950/70 dark:text-sky-100">
                        <div>
                          <p className="text-sm font-black leading-none">{vehicle.speed}</p>
                          <p className="text-[9px] font-bold uppercase">km/h</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 capitalize text-blue-800 dark:bg-sky-950/60 dark:text-sky-100"><Activity size={11} />{vehicle.status}</span>
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-950/60 dark:text-sky-200"><Power size={11} />Ignition {vehicle.ignition}</span>
                    </div>
                  </button>
                );
              })}

              {filteredVehicles.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                  <p className="font-black text-slate-950">No vehicles found</p>
                  <p className="mt-1 text-sm text-slate-500">Try clearing the search or filters.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-2xl border border-sky-200 bg-white p-3 shadow-md shadow-sky-100/70 dark:border-sky-900/70 dark:bg-slate-950 sm:rounded-3xl sm:p-4">
            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 dark:border-sky-900/70 dark:bg-slate-950 sm:min-h-[420px] sm:rounded-3xl">
              <svg
                viewBox="0 0 100 66"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                style={{ backgroundColor: mapBackground }}
              >
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke={gridStroke} strokeWidth="0.14" />
                  </pattern>
                </defs>
                <rect width="100" height="66" fill="url(#grid)" />

                <text x="2" y="4" fontSize="1.5" fill={mapLabelFill} fontWeight="bold">
                  Manila Region
                </text>
                <text x="2" y="60" fontSize="0.8" fill={mapSubLabelFill}>
                  Lat: 14.55-14.65 | Lng: 120.95-121.05
                </text>

                {filteredVehicles.map((vehicle) => {
                  const { x, y } = getMapPosition(vehicle);
                  const isSelected = selectedVehicle?.id === vehicle.id;
                  const markerColor = statusMarkerColors[vehicle.status];
                  const markerOpacity = vehicle.status === 'offline' ? 0.72 : 1;
                  const markerScale = isSelected ? 1.28 : 1;

                  return (
                    <g key={vehicle.id} onClick={() => handleSelectVehicle(vehicle)} style={{ cursor: 'pointer' }}>
                      {isSelected && (
                        <circle cx={x} cy={y} r="3.4" fill="none" stroke="#0284c7" strokeWidth="0.42" className="animate-pulse" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 1.45 : 1.05}
                        fill={isDark ? '#020617' : '#ffffff'}
                        stroke={markerColor}
                        strokeWidth="0.36"
                        opacity={markerOpacity}
                      />
                      <g transform={`translate(${x} ${y}) rotate(${vehicle.heading}) scale(${markerScale})`}>
                        <path
                          d="M 0 -3.25 L 2.05 2.15 L 0 1.18 L -2.05 2.15 Z"
                          fill={markerColor}
                          stroke={isDark ? '#e0f2fe' : '#ffffff'}
                          strokeWidth="0.32"
                          strokeLinejoin="round"
                          opacity={markerOpacity}
                        />
                        <path
                          d="M 0 -1.85 L 0.78 0.56 L 0 0.18 L -0.78 0.56 Z"
                          fill={isDark ? '#020617' : '#ffffff'}
                          opacity="0.82"
                        />
                      </g>
                      {isSelected && (
                        <text x={x + 3.2} y={y - 2.4} fontSize="1.05" fill={mapLabelFill} fontWeight="bold">
                          {vehicle.heading} deg
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute right-2 top-2 rounded-xl border border-sky-100 bg-white/95 px-2.5 py-2 text-[11px] font-black text-blue-700 shadow-sm shadow-sky-200/60 backdrop-blur dark:border-sky-900 dark:bg-slate-950/95 dark:text-sky-200 sm:right-3 sm:top-3 sm:px-3 sm:text-xs">
                <span className="flex items-center gap-2"><LocateFixed size={14} />{filteredVehicles.length} of {vehicles.length} vehicles</span>
              </div>

              <div className="absolute left-2 top-2 rounded-2xl border border-sky-100 bg-white/95 p-2.5 text-blue-900 shadow-sm shadow-sky-200/60 backdrop-blur dark:border-sky-900 dark:bg-slate-950/95 dark:text-sky-100 sm:left-3 sm:top-3 sm:p-3">
                <div className="flex items-center gap-2">
                  <Navigation size={17} className="text-blue-600" />
                  <div>
                    <p className="text-xs font-black">Metro Manila</p>
                    <p className="text-[10px] font-semibold text-sky-600 dark:text-sky-300">GPS tracking grid</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 sm:gap-3 sm:text-sm">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1.5 dark:border-sky-900 dark:bg-slate-900 sm:px-3">
                  <div className={`grid size-5 place-items-center rounded-full ${color} text-white`}>
                    <Truck size={11} />
                  </div>
                  <span className="capitalize text-blue-900 dark:text-sky-100">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-0">
            <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-md shadow-sky-100/70 dark:border-sky-900/70 dark:bg-slate-950 sm:rounded-3xl xl:h-full">
              <div className="border-b border-sky-100 bg-gradient-to-r from-blue-700 to-sky-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-white/15">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-100">Selected Unit</p>
                    <h3 className="text-lg font-black">Vehicle Details</h3>
                  </div>
                </div>
              </div>

              {selectedVehicle ? (
                <div className="max-h-[560px] min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4 xl:max-h-none">
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 dark:border-sky-900 dark:bg-slate-900">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Plate Number</p>
                    <p className="font-black text-slate-950">{selectedVehicle.plateNumber}</p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><Truck size={13} />Vehicle Name</p>
                    <p className="font-black text-slate-950">{selectedVehicle.name}</p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><UserRound size={13} />Driver</p>
                    <p className="font-black text-slate-950">{selectedVehicle.driver}</p>
                  </div>

                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><Activity size={13} />Status</p>
                    <StatusBadge status={selectedVehicle.status} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowVehicleDetails(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                  >
                    <Eye size={18} />
                    View More Details
                  </button>

                  <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-1">
                    {detailMetrics.map((metric) => {
                      const Icon = metric.icon;

                      return (
                        <div key={metric.label} className="rounded-2xl bg-sky-50/80 p-3 dark:bg-slate-900">
                          <div className="mb-2 flex items-center gap-2 text-sky-700">
                            <Icon size={16} />
                            <p className="text-xs font-black uppercase tracking-[0.12em]">{metric.label}</p>
                          </div>
                          <p className="text-sm font-black text-slate-950">{metric.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><MapPin size={13} />Location</p>
                    <div className="mt-1 flex gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                      <p className="text-sm font-bold text-slate-950">{selectedVehicle.address}</p>
                    </div>
                    <p className="font-mono text-sm text-slate-900">
                      {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-sky-700">
                      <Navigation size={13} />
                      Facing {selectedVehicle.heading} deg
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><Fuel size={13} />Fuel Level</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${selectedVehicle.fuelLevel}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-600">{selectedVehicle.fuelLevel}%</p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700"><Route size={13} />Odometer</p>
                    <p className="text-sm font-black text-slate-950">
                      {selectedVehicle.odometer.toLocaleString()} km
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-2xl bg-sky-50/80 p-3 dark:bg-slate-900">
                      <p className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700"><Activity size={12} />Engine</p>
                      <p className="font-black text-slate-950">{selectedVehicle.engineStatus}</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50/80 p-3 dark:bg-slate-900">
                      <p className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700"><Truck size={12} />Load</p>
                      <p className="font-black text-slate-950">{selectedVehicle.loadWeight.toLocaleString()} kg</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50/80 p-3 dark:bg-slate-900">
                      <p className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700"><Battery size={12} />Battery</p>
                      <p className="font-black text-slate-950">{selectedVehicle.batteryVoltage} V</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50/80 p-3 dark:bg-slate-900">
                      <p className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700"><Wifi size={12} />GPS</p>
                      <p className="font-black text-slate-950">{selectedVehicle.gpsSignal}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs font-semibold text-slate-500">
                    Last updated: {new Date(selectedVehicle.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <p className="p-4 text-sm text-slate-500">Select a vehicle on the map to view details</p>
              )}
            </div>
          </div>
        </div>

        {selectedVehicle && showVehicleDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-5">
            <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-sky-100 bg-white shadow-2xl shadow-slate-950/30 dark:border-sky-900 dark:bg-slate-950">
              <div className="sticky top-0 z-10 border-b border-sky-100 bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 p-4 text-white sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/15">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-100">Vehicle Tracking</p>
                      <h2 className="text-2xl font-black">{selectedVehicle.name}</h2>
                      <p className="text-sm font-semibold text-sky-100">{selectedVehicle.plateNumber} - {selectedVehicle.driver}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVehicleDetails(false)}
                    className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/10 transition hover:bg-white/20"
                    title="Close details"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Speed', value: `${selectedVehicle.speed} km/h`, icon: Gauge, tone: 'text-sky-600' },
                    { label: 'Fuel Load', value: `${selectedVehicle.fuelLoad} L`, icon: Fuel, tone: 'text-emerald-600' },
                    { label: 'Engine Temp', value: `${selectedVehicle.engineTemperature} deg C`, icon: Activity, tone: 'text-orange-600' },
                    { label: 'Battery', value: `${selectedVehicle.batteryVoltage} V`, icon: Battery, tone: 'text-blue-600' },
                  ].map((metric) => {
                    const Icon = metric.icon;

                    return (
                      <div key={metric.label} className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-900 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                            <p className="mt-2 text-2xl font-black text-slate-950">{metric.value}</p>
                          </div>
                          <Icon size={28} className={metric.tone} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm dark:border-sky-900 dark:bg-slate-900">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
                      <Gauge size={20} className="text-sky-500" />
                      Speed Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={selectedVehicle.telemetryHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e3a5f' : '#cbd5e1'} />
                        <XAxis dataKey="time" stroke={isDark ? '#bae6fd' : '#475569'} />
                        <YAxis stroke={isDark ? '#bae6fd' : '#475569'} />
                        <Tooltip isAnimationActive={false} />
                        <Line type="monotone" dataKey="speed" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 3 }} activeDot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </section>

                  <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm dark:border-sky-900 dark:bg-slate-900">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
                      <Fuel size={20} className="text-emerald-500" />
                      Fuel Consumption
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={selectedVehicle.telemetryHistory}>
                        <defs>
                          <linearGradient id="vehicleFuelGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.75} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e3a5f' : '#cbd5e1'} />
                        <XAxis dataKey="time" stroke={isDark ? '#bae6fd' : '#475569'} />
                        <YAxis stroke={isDark ? '#bae6fd' : '#475569'} />
                        <Tooltip isAnimationActive={false} />
                        <Area type="monotone" dataKey="fuelConsumption" stroke="#10b981" strokeWidth={3} fill="url(#vehicleFuelGradient)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </section>

                  <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm dark:border-sky-900 dark:bg-slate-900">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
                      <Activity size={20} className="text-orange-500" />
                      Engine Temperature
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={selectedVehicle.telemetryHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e3a5f' : '#cbd5e1'} />
                        <XAxis dataKey="time" stroke={isDark ? '#bae6fd' : '#475569'} />
                        <YAxis stroke={isDark ? '#bae6fd' : '#475569'} />
                        <Tooltip isAnimationActive={false} />
                        <Line type="monotone" dataKey="engineTemperature" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 3 }} activeDot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </section>

                  <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm dark:border-sky-900 dark:bg-slate-900">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-950">
                      <Battery size={20} className="text-blue-500" />
                      Battery Voltage
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={selectedVehicle.telemetryHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e3a5f' : '#cbd5e1'} />
                        <XAxis dataKey="time" stroke={isDark ? '#bae6fd' : '#475569'} />
                        <YAxis domain={[12, 15]} stroke={isDark ? '#bae6fd' : '#475569'} />
                        <Tooltip isAnimationActive={false} />
                        <Line type="monotone" dataKey="batteryVoltage" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 3 }} activeDot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </section>
                </div>

                <section className="grid gap-3 rounded-3xl border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-900 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Location', selectedVehicle.address],
                    ['Odometer', `${selectedVehicle.odometer.toLocaleString()} km`],
                    ['Engine', selectedVehicle.engineStatus],
                    ['GPS', selectedVehicle.gpsSignal],
                    ['Load', `${selectedVehicle.loadWeight.toLocaleString()} kg`],
                    ['Oil Pressure', `${selectedVehicle.oilPressure} bar`],
                    ['Coolant', selectedVehicle.coolantLevel],
                    ['Last Service', selectedVehicle.lastService],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white p-3 dark:bg-slate-950">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
