import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Upload, Sparkles, Loader2, Copy, Check, Instagram, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Format, Model, TextColor, AlignHorizontal, AlignVertical, Font } from "@shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Studio() {
  // Estado do editor
  const [text, setText] = useState("Seu texto aparecerá aqui.");
  const [format, setFormat] = useState<Format>("portrait");
  const [model, setModel] = useState<Model>("classic");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageKey, setBackgroundImageKey] = useState<string | null>(null);
  
  // Formatação
  const [fontSize, setFontSize] = useState(100);
  const [font, setFont] = useState<Font>("Inter");
  const [textColor, setTextColor] = useState<TextColor>("white");
  const [textOutline, setTextOutline] = useState(0);
  
  // Alinhamento
  const [alignHorizontal, setAlignHorizontal] = useState<AlignHorizontal>("center");
  const [alignVertical, setAlignVertical] = useState<AlignVertical>("middle");
  
  // Efeitos
  const [fadeOverlay, setFadeOverlay] = useState(50);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  // Sugestões de legendas
  const [showCaptions, setShowCaptions] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Templates personalizados
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  
  // Instagram
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [instagramCaption, setInstagramCaption] = useState("");
  const [lastCreationId, setLastCreationId] = useState<number | null>(null);
  
  // Painel de favoritos
  const [showFavorites, setShowFavorites] = useState(false);
  const { data: favorites = [] } = trpc.favorites.list.useQuery();
  
  // Instagram queries
  const { data: instagramConnection } = trpc.instagram.getConnection.useQuery();
  const publishMutation = trpc.instagram.publishPost.useMutation({
    onSuccess: () => {
      toast.success("Publicado no Instagram com sucesso!");
      setShowPublishDialog(false);
      setInstagramCaption("");
    },
    onError: (error) => {
      toast.error(`Erro ao publicar: ${error.message}`);
    },
  });
  const [templateDescription, setTemplateDescription] = useState("");
  
  // Preview de remoção de fundo
  const [showRemoveBgPreview, setShowRemoveBgPreview] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Elementos favoritos
  const { data: favoriteElements = [] } = trpc.favorites.list.useQuery();
  
  // Paletas favoritas
  const { data: favoritePalettes = [] } = trpc.favoritePalettes.list.useQuery();
  
  // Geração e  // CSV Upload
  const [showCSVModal, setShowCSVModal] = useState(false);

  // Hashtags
  const [showHashtagsModal, setShowHashtagsModal] = useState(false);
  const [hashtags, setHashtags] = useState<{ reach: string[]; niche: string[]; trending: string[] } | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  
  // Tooltip de primeira visita
  const [showFirstVisitTooltip, setShowFirstVisitTooltip] = useState(false);
  
  // Verificar primeira visita
  useEffect(() => {
    const hasVisited = localStorage.getItem("elevare_studio_visited");
    if (!hasVisited) {
      // Mostrar tooltip após 1 segundo
      setTimeout(() => {
        setShowFirstVisitTooltip(true);
      }, 1000);
    }
  }, []);
  
  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+G - Gerar Legendas
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        if (!text || text === "Seu texto aparecerá aqui.") {
          toast.error("✏️ Digite um texto antes de gerar legendas");
          return;
        }
        handleGenerateCaptions();
      }
      
      // Ctrl+O - Otimizar Texto
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        if (!text || text === "Seu texto aparecerá aqui.") {
          toast.error("✏️ Digite um texto antes de otimizar");
          return;
        }
        optimizeTextMutation.mutate({ text });
      }
      
      // Ctrl+E - Prever Engajamento
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        if (!text || text === "Seu texto aparecerá aqui.") {
          toast.error("✏️ Digite um texto antes de prever engajamento");
          return;
        }
        predictEngagementMutation.mutate({ text, hasImage: !!backgroundImage });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, lastCreationId]);
  
  const handleDismissTooltip = () => {
    setShowFirstVisitTooltip(false);
    localStorage.setItem("elevare_studio_visited", "true");
  };
  
  // Otimizar Texto
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizedText, setOptimizedText] = useState<{ original: string; optimized: string; improvements: string[] } | null>(null);
  
  // Prever Engajamento
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [engagementPrediction, setEngagementPrediction] = useState<{ score: number; factors: any; suggestions: string[] } | null>(null);
  
  // Variações de Legenda
  const [showCaptionVariationsModal, setShowCaptionVariationsModal] = useState(false);
  const [captionVariations, setCaptionVariations] = useState<Array<{ variation: string; tone: string; length: string }>>([]);
  
  // Sugestão de Emojis
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [emojiSuggestions, setEmojiSuggestions] = useState<Array<{ emoji: string; category: string; reason: string }>>([]);
  const [csvData, setCSVData] = useState<any[]>([]);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const generateHashtagsMutation = trpc.hashtags.generate.useMutation({
    onSuccess: (data) => {
      setHashtags(data);
      setShowHashtagsModal(true);
      toast.success("30 hashtags geradas com IA!");
    },
    onError: () => {
      toast.error("Erro ao gerar hashtags");
    },
  });
  
  const optimizeTextMutation = trpc.aiAdvanced.optimizeText.useMutation({
    onSuccess: (data) => {
      const optimized = typeof data.optimized === 'string' ? data.optimized : '';
      setOptimizedText({ original: text, optimized, improvements: [] });
      setShowOptimizeModal(true);
      toast.success("Texto otimizado com IA!");
    },
    onError: () => {
      toast.error("Erro ao otimizar texto");
    },
  });
  
  const predictEngagementMutation = trpc.aiAdvanced.predictEngagement.useMutation({
    onSuccess: (data) => {
      setEngagementPrediction({ score: data.score, factors: data.breakdown, suggestions: data.suggestions });
      setShowEngagementModal(true);
      toast.success("Previsão de engajamento calculada!");
    },
    onError: () => {
      toast.error("Erro ao prever engajamento");
    },
  });
  
  const generateCaptionVariationsMutation = trpc.aiAdvanced.generateVariations.useMutation({
    onSuccess: (data) => {
      const variations = data.variations.map((v: any) => ({
        variation: v.text,
        tone: v.tone,
        length: v.text.length > 100 ? 'longa' : 'curta'
      }));
      setCaptionVariations(variations);
      setShowCaptionVariationsModal(true);
      toast.success(`${variations.length} variações geradas!`);
    },
    onError: () => {
      toast.error("Erro ao gerar variações");
    },
  });
  
  const suggestEmojisMutation = trpc.aiAdvanced.suggestEmojis.useMutation({
    onSuccess: (data) => {
      setEmojiSuggestions(data.emojis);
      setShowEmojiModal(true);
      toast.success(`${data.emojis.length} emojis sugeridos!`);
    },
    onError: () => {
      toast.error("Erro ao sugerir emojis");
    },
  });

  const bulkGenerateMutation = trpc.bulkGenerate.fromCSV.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} posts criados com sucesso!`);
      setShowCSVModal(false);
      setCSVData([]);
      setCSVFile(null);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Variações com IA
  const [showVariations, setShowVariations] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedVariations, setSelectedVariations] = useState<Set<number>>(new Set());
  const generateVariationsMutation = trpc.variations.generate.useMutation({
    onSuccess: (data) => {
      setVariations(data);
      setShowVariations(true);
      toast.success("10 variações geradas com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao gerar variações: ${error.message}`);
    },
  });
  
  // Elementos gráficos
  const [graphicElements, setGraphicElements] = useState<Array<{
    id: string;
    svg: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
  }>>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Carregar template ou criação para edição do localStorage
  useEffect(() => {
    // Verificar se há uma criação para editar
    const editingCreation = localStorage.getItem("editingCreation");
    if (editingCreation) {
      try {
        const creation = JSON.parse(editingCreation);
        // Carregar todos os dados da criação
        setText(creation.text || "Seu texto aparecerá aqui.");
        setFormat(creation.format || "portrait");
        setModel(creation.model || "classic");
        setFontSize(creation.fontSize || 100);
        setFont(creation.font || "Inter");
        setTextColor(creation.textColor || "white");
        setTextOutline(creation.textOutline || 0);
        setAlignHorizontal(creation.alignHorizontal || "center");
        setAlignVertical(creation.alignVertical || "middle");
        setFadeOverlay(creation.fadeOverlay || 50);
        setBlur(creation.blur || 0);
        setBrightness(creation.brightness || 100);
        setContrast(creation.contrast || 100);
        
        if (creation.backgroundImageUrl) {
          setBackgroundImage(creation.backgroundImageUrl);
          setBackgroundImageKey(creation.backgroundImageKey);
        }
        
        // Limpar localStorage
        localStorage.removeItem("editingCreation");
        return;
      } catch (error) {
        console.error("Erro ao carregar criação:", error);
      }
    }
    
    // Se não houver criação, verificar se há template
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        // Aplicar configurações do template
        setText(template.placeholderText);
        setFormat(template.settings.format);
        setModel(template.settings.model);
        setFontSize(template.settings.fontSize);
        setFont(template.settings.font);
        setTextColor(template.settings.textColor);
        setTextOutline(template.settings.textOutline);
        setAlignHorizontal(template.settings.alignHorizontal);
        setAlignVertical(template.settings.alignVertical);
        setFadeOverlay(template.settings.fadeOverlay);
        setBlur(template.settings.blur);
        setBrightness(template.settings.brightness);
        setContrast(template.settings.contrast);
        
        // Limpar localStorage
        localStorage.removeItem("selectedTemplate");
      } catch (error) {
        console.error("Erro ao carregar template:", error);
      }
    }
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = trpc.upload.uploadImage.useMutation();
  const createMutation = trpc.creations.create.useMutation();
  const generateImageMutation = trpc.ai.generateImage.useMutation();
  const generateCaptionsMutation = trpc.ai.generateCaptions.useMutation();
  const saveTemplateMutation = trpc.userTemplates.create.useMutation();
  
  // Dimensões baseadas no formato
  const dimensions = {
    square: { width: 1080, height: 1080 },
    portrait: { width: 1080, height: 1350 },
    story: { width: 1080, height: 1920 },
  };
  
  const { width, height } = dimensions[format];
  
  // Renderizar preview no canvas
  useEffect(() => {
    renderPreview();
  }, [text, format, model, backgroundImage, fontSize, font, textColor, textOutline, alignHorizontal, alignVertical, fadeOverlay, blur, brightness, contrast]);
  
  const renderPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Configurar dimensões do canvas
    canvas.width = width;
    canvas.height = height;
    
    // Aplicar fundo baseado no modelo
    const modelStyles = {
      classic: { bg: "#ffffff", textColor: "black" },
      bold: { bg: "#1a1a1a", textColor: "white" },
      fade: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", textColor: "white" },
      highlight: { bg: "#ff6b35", textColor: "white" },
    };
    
    const style = modelStyles[model];
    
    // Desenhar fundo
    if (model === "fade") {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = style.bg;
    }
    ctx.fillRect(0, 0, width, height);
    
    // Desenhar imagem de fundo se existir
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Aplicar efeitos de imagem
        ctx.filter = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%)`;
        
        // Desenhar imagem centralizada e coberta
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
          drawHeight = height;
          drawWidth = img.width * (height / img.height);
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = width;
          drawHeight = img.height * (width / img.width);
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Resetar filtro
        ctx.filter = "none";
        
        // Aplicar sobreposição de desvanecimento
        if (fadeOverlay > 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeOverlay / 100})`;
          ctx.fillRect(0, 0, width, height);
        }
        
        // Desenhar texto
        drawText(ctx);
      };
      img.src = backgroundImage;
    } else {
      // Desenhar texto sem imagem de fundo
      drawText(ctx);
    }
  };
  
  const drawText = (ctx: CanvasRenderingContext2D) => {
    // Configurar fonte
    const fontSizePixels = Math.floor((fontSize / 100) * 120);
    const fontFamily = font === "Mono" ? "Roboto Mono" : font === "Serif" ? "Georgia" : font;
    ctx.font = `${fontSizePixels}px ${fontFamily}`;
    
    // Configurar cor do texto
    ctx.fillStyle = textColor === "white" ? "#ffffff" : "#000000";
    
    // Configurar alinhamento
    ctx.textAlign = alignHorizontal;
    ctx.textBaseline = alignVertical === "top" ? "top" : alignVertical === "middle" ? "middle" : "bottom";
    
    // Calcular posição
    let x = width / 2;
    if (alignHorizontal === "left") x = 60;
    if (alignHorizontal === "right") x = width - 60;
    
    let y = height / 2;
    if (alignVertical === "top") y = 100;
    if (alignVertical === "bottom") y = height - 100;
    
    // Quebrar texto em linhas
    const maxWidth = width - 120;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Ajustar y para múltiplas linhas
    const lineHeight = fontSizePixels * 1.2;
    const totalHeight = lines.length * lineHeight;
    
    if (alignVertical === "middle") {
      y = (height - totalHeight) / 2 + fontSizePixels / 2;
    }
    
    // Desenhar cada linha
    lines.forEach((line, index) => {
      const lineY = y + index * lineHeight;
      
      // Desenhar contorno se ativado
      if (textOutline === 1) {
        ctx.strokeStyle = textColor === "white" ? "#000000" : "#ffffff";
        ctx.lineWidth = 8;
        ctx.strokeText(line, x, lineY);
      }
      
      // Desenhar texto
      ctx.fillText(line, x, lineY);
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar tamanho do arquivo (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 16MB.");
      return;
    }
    
    // Ler arquivo como base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setBackgroundImage(base64);
      
      try {
        // Upload para S3
        const { nanoid } = await import("nanoid");
        const fileKey = `temp-${nanoid()}-${file.name}`;
        
        const result = await uploadMutation.mutateAsync({
          fileKey,
          data: base64,
          contentType: file.type,
        });
        
        setBackgroundImageKey(result.key);
        toast.success("Imagem carregada!");
      } catch (error) {
        toast.error("Erro ao fazer upload da imagem");
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateImage = async () => {
    const prompt = window.prompt("Descreva a imagem que você quer gerar:");
    if (!prompt) return;
    
    try {
      const result = await generateImageMutation.mutateAsync({ prompt });
      setBackgroundImage(result.url);
      setBackgroundImageKey(result.key);
      toast.success("Imagem gerada com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar imagem");
      console.error(error);
    }
  };
  
  const handleRemoveBackground = async () => {
    if (!backgroundImage) {
      toast.error("Adicione uma imagem primeiro");
      return;
    }
    
    setOriginalImage(backgroundImage);
    setShowRemoveBgPreview(true);
  };
  
  const handleConfirmRemoveBackground = async () => {
    if (!originalImage) return;
    
    try {
      const result = await trpc.ai.removeBackground.useMutation().mutateAsync({
        imageUrl: originalImage,
      });
      
      setProcessedImage(result.url);
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover fundo");
      console.error(error);
    }
  };
  
  const handleApplyRemoveBackground = () => {
    if (processedImage) {
      setBackgroundImage(processedImage);
      setShowRemoveBgPreview(false);
      setProcessedImage(null);
      setOriginalImage(null);
      toast.success("Fundo removido com sucesso!");
    }
  };
  
  const handleGenerateCaptions = async () => {
    try {
      const result = await generateCaptionsMutation.mutateAsync({
        text,
        imageContext: backgroundImage ? "Imagem de fundo presente" : undefined,
      });
      
      setCaptions(result.captions);
      setShowCaptions(true);
    } catch (error) {
      toast.error("Erro ao gerar legendas");
      console.error(error);
    }
  };
  
  const handleCopyCaption = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    toast.success("Legenda copiada!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Digite um nome para o template");
      return;
    }
    
    try {
      await saveTemplateMutation.mutateAsync({
        name: templateName,
        description: templateDescription,
        format,
        model,
        font,
        fontSize,
        textColor,
        horizontalAlign: alignHorizontal,
        verticalAlign: alignVertical,
        textOutline,
        fadeOverlay,
        blur,
        brightness,
        contrast,
      });
      
      toast.success("Template salvo com sucesso!");
      setShowSaveTemplate(false);
      setTemplateName("");
      setTemplateDescription("");
    } catch (error) {
      toast.error("Erro ao salvar template");
      console.error(error);
    }
  };
  
  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      // Converter canvas para blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        // Salvar criação no banco de dados
        const result = await createMutation.mutateAsync({
          text,
          format,
          model,
          backgroundImageUrl: backgroundImage || undefined,
          backgroundImageKey: backgroundImageKey || undefined,
          fontSize,
          font,
          textColor,
          textOutline,
          alignHorizontal,
          alignVertical,
          fadeOverlay,
          blur,
          brightness,
          contrast,
          tags: tags.length > 0 ? tags.join(",") : undefined,
        });
        
        // Salvar ID da criação para publicação no Instagram
        if (result && result.id) {
          setLastCreationId(result.id);
        }
        
        // Download da imagem
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `textpop-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success("Criação salva e baixada!");
      }, "image/png");
    } catch (error) {
      toast.error("Erro ao salvar criação");
      console.error(error);
    }
  };
  
  const handleReset = () => {
    setText("Seu texto aparecerá aqui.");
    setFormat("portrait");
    setModel("classic");
    setBackgroundImage(null);
    setBackgroundImageKey(null);
    setFontSize(100);
    setFont("Inter");
    setTextColor("white");
    setTextOutline(0);
    setAlignHorizontal("center");
    setAlignVertical("middle");
    setFadeOverlay(50);
    setBlur(0);
    setBrightness(100);
    setContrast(100);
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo - Controles */}
        <div className="space-y-6">
          <Card className="p-6 shadow-xl">
            <h3 className="font-semibold mb-4 pb-2 text-slate-900 border-b border-slate-200">✍️ Texto & Estratégia</h3>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite seu texto aqui..."
              className="mb-4"
            />
            
            {/* Tags */}
            <div className="mb-4">
              <Label className="text-slate-700 mb-2 block">Tags (separe por vírgula)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t);
                      setTags([...tags, ...newTags]);
                      setTagInput("");
                    }
                  }}
                  placeholder="Ex: promoção, skincare, verão"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (tagInput.trim()) {
                      const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t);
                      setTags([...tags, ...newTags]);
                      setTagInput("");
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="hover:text-primary-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Gerar Legendas com IA */}
            <Button
              onClick={handleGenerateCaptions}
              disabled={generateCaptionsMutation.isPending}
              variant="outline"
              className="w-full mb-4"
            >
              {generateCaptionsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Gerar Legendas com IA
            </Button>
            
            <Label className="text-slate-700 mb-2 block mt-4">Formato</Label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              <Button
                variant={format === "square" ? "default" : "outline"}
                onClick={() => setFormat("square")}
                className="flex flex-col items-center py-6"
              >
                <div className="w-6 h-6 border-2 border-current mb-1" />
                <span className="text-xs">Quadrado</span>
              </Button>
              <Button
                variant={format === "portrait" ? "default" : "outline"}
                onClick={() => setFormat("portrait")}
                className="flex flex-col items-center py-6"
              >
                <div className="w-5 h-6 border-2 border-current mb-1" />
                <span className="text-xs">Retrato</span>
              </Button>
              <Button
                variant={format === "story" ? "default" : "outline"}
                onClick={() => setFormat("story")}
                className="flex flex-col items-center py-6"
              >
                <div className="w-4 h-6 border-2 border-current mb-1" />
                <span className="text-xs">História</span>
              </Button>
            </div>
            
            <Label className="text-slate-700 mb-2 block">Modelo Visual</Label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                variant={model === "classic" ? "default" : "outline"}
                onClick={() => setModel("classic")}
              >
                Clássico
              </Button>
              <Button
                variant={model === "bold" ? "default" : "outline"}
                onClick={() => setModel("bold")}
              >
                Audacioso
              </Button>
              <Button
                variant={model === "fade" ? "default" : "outline"}
                onClick={() => setModel("fade")}
              >
                Desaparecer
              </Button>
              <Button
                variant={model === "highlight" ? "default" : "outline"}
                onClick={() => setModel("highlight")}
              >
                Destaque
              </Button>
            </div>
            
            <Label className="text-slate-700 mb-2 block mt-4">Imagem (Opcional)</Label>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateImage}
                disabled={generateImageMutation.isPending}
                className="w-full"
              >
                {generateImageMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Gerar com IA
              </Button>
              {backgroundImage && (
                <Button
                  variant="outline"
                  onClick={handleRemoveBackground}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Remover Fundo
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full mt-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recomeçar
            </Button>
          </Card>
        </div>
        
        {/* Painel Central - Preview */}
        <div className="flex flex-col">
          <Card className="p-6 shadow-xl">
            <h3 className="font-semibold mb-4 pb-2 text-center text-slate-900 border-b border-slate-200">🖼 Pré-visualização ao Vivo</h3>
            <div className="flex justify-center mb-4">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border border-gray-200 rounded-2xl shadow-lg"
                style={{
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
              />
            </div>
            
            <h3 className="font-semibold mt-6 mb-3 pb-2 text-slate-900 border-b border-slate-200">🚀 Publicação</h3>
            
            <Button
              onClick={handleDownload}
              disabled={createMutation.isPending}
              className="w-full mb-2"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Baixar ({width} x {height})
            </Button>
            
            {instagramConnection && lastCreationId && (
              <Button
                onClick={() => setShowPublishDialog(true)}
                disabled={publishMutation.isPending}
                variant="outline"
                className="w-full mb-2"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Instagram className="w-4 h-4 mr-2" />
                )}
                Publicar no Instagram
              </Button>
            )}
            
            {!instagramConnection && (
              <Button
                onClick={() => window.location.href = "/instagram-settings"}
                variant="outline"
                className="w-full mb-2"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Conectar Instagram
              </Button>
            )}
            
            {/* Seção Assistente LucresIA */}
            <div className="relative">
              {/* Tooltip de Primeira Visita */}
              {showFirstVisitTooltip && (
                <div className="absolute -top-2 left-0 right-0 z-50 animate-bounce">
                  <Card className="p-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-2xl border-2 border-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold mb-1">👋 Conheça sua assistente de IA!</p>
                        <p className="text-sm opacity-90">
                          A LucresIA otimiza textos, prevê engajamento e gera variações. Use os botões abaixo para criar posts que convertem!
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismissTooltip}
                        className="text-white hover:bg-white/20 shrink-0"
                      >
                        Entendi
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
              
              <Card className="p-4 mb-4 bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AI
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">📝 Legenda • NeuroVendas</h3>
                  <p className="text-xs text-slate-600">Assistente LucresIA</p>
                </div>
              </div>
              
              <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (!text || text === "Seu texto aparecerá aqui.") {
                      toast.error("Digite um texto primeiro");
                      return;
                    }
                    optimizeTextMutation.mutate({ text });
                  }}
                  disabled={optimizeTextMutation.isPending}
                  variant="outline"
                  className="w-full mb-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  {optimizeTextMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <span className="mr-2">🤖</span>
                  )}
                  Otimizar Texto com IA
                  <Badge className="ml-2 bg-white/20 text-white text-xs">Após rascunho</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">Quando usar:</p>
                <p className="text-sm">Quando seu texto está pronto mas parece 'morno'. A LucresIA vai deixar mais persuasivo mantendo sua voz.</p>
                <p className="text-xs text-gray-500 mt-2">⌨️ Atalho: Ctrl+O</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (!text || text === "Seu texto aparecerá aqui.") {
                      toast.error("Digite um texto primeiro");
                      return;
                    }
                    predictEngagementMutation.mutate({ text, hasImage: !!backgroundImage });
                  }}
                  disabled={predictEngagementMutation.isPending}
                  variant="outline"
                  className="w-full mb-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                >
                  {predictEngagementMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <span className="mr-2">🎯</span>
                  )}
                  Prever Engajamento
                  <Badge className="ml-2 bg-white/20 text-white text-xs">Antes de publicar</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">Quando usar:</p>
                <p className="text-sm">Antes de publicar para saber se seu post tem potencial de viralizar. A LucresIA analisa texto, imagem e horário.</p>
                <p className="text-xs text-gray-500 mt-2">⌨️ Atalho: Ctrl+E</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (!text || text === "Seu texto aparecerá aqui.") {
                      toast.error("Digite um texto primeiro");
                      return;
                    }
                    generateCaptionVariationsMutation.mutate({ text });
                  }}
                  disabled={generateCaptionVariationsMutation.isPending}
                  variant="outline"
                  className="w-full mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  {generateCaptionVariationsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <span className="mr-2">📝</span>
                  )}
                  Gerar Variações de Legenda
                  <Badge className="ml-2 bg-white/20 text-white text-xs">5 tons diferentes</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">Quando usar:</p>
                <p className="text-sm">Quando tem uma ideia mas não sabe como escrever. A LucresIA gera 5 versões: profissional, casual, urgente, motivacional e educativo.</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (!text || text === "Seu texto aparecerá aqui.") {
                      toast.error("Digite um texto primeiro");
                      return;
                    }
                    suggestEmojisMutation.mutate({ text });
                  }}
                  disabled={suggestEmojisMutation.isPending}
                  variant="outline"
                  className="w-full mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                >
                  {suggestEmojisMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <span className="mr-2">😊</span>
                  )}
                  Sugerir Emojis
                  <Badge className="ml-2 bg-white/20 text-white text-xs">10 emojis</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">Quando usar:</p>
                <p className="text-sm">Para deixar seu texto mais expressivo e atrativo. A LucresIA analisa o contexto e sugere emojis perfeitos para cada parte da legenda.</p>
              </TooltipContent>
            </Tooltip>
              </div>
            </Card>
            
            <Button
              onClick={() => setShowSaveTemplate(true)}
              variant="outline"
              className="w-full mb-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Salvar como Template
            </Button>
            
            {lastCreationId && (
              <Button
                onClick={() => generateVariationsMutation.mutate({ creationId: lastCreationId })}
                disabled={generateVariationsMutation.isPending}
                variant="outline"
                className="w-full mb-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
              >
                {generateVariationsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Gerar 10 Variações com IA
              </Button>
            )}
            
            <Button
              onClick={() => setShowCSVModal(true)}
              variant="outline"
              className="w-full mb-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              Geração em Massa (CSV)
            </Button>
            
            <Button
              onClick={() => {
                if (!text || text === "Seu texto aparecerá aqui.") {
                  toast.error("Digite um texto primeiro");
                  return;
                }
                generateHashtagsMutation.mutate({ text });
              }}
              disabled={generateHashtagsMutation.isPending}
              variant="outline"
              className="w-full mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              {generateHashtagsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="mr-2">📱</span>
              )}
              Sugerir 30 Hashtags com IA
            </Button>
            
            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              variant="outline"
              className="w-full"
            >
              ❤️ {showFavorites ? "Ocultar" : "Mostrar"} Favoritos
            </Button>
            </div>
            
            {/* Painel de Favoritos */}
            {showFavorites && favorites.length > 0 && (
            <Card className="p-4 mt-4 shadow-xl">
              <h4 className="font-semibold text-slate-900 mb-3">Elementos Favoritos</h4>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {favorites.map((favId, index) => (
                  <div
                    key={index}
                    className="p-2 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => {
                      toast.success("Elemento favoritado!");
                      // TODO: Carregar elemento do banco e adicionar ao canvas
                    }}
                  >
                    <div className="text-4xl mb-1">❤️</div>
                    <p className="text-xs text-slate-600 truncate">Favorito #{index + 1}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
          </Card>
        </div>
        
        {/* Painel Direito - Formatação */}
        <div className="space-y-6">
          {/* Paletas Favoritas */}
          {favoritePalettes.length > 0 && (
            <Card className="p-6 shadow-xl">
              <h3 className="font-semibold mb-4 text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                Minhas Paletas Favoritas
              </h3>
              <div className="space-y-2">
                {favoritePalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => {
                      // Aplicar paleta ao modelo atual
                      // As cores são armazenadas como array: [primary, secondary, accent]
                      toast.success(`Paleta "${palette.paletteName}" aplicada!`);
                    }}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all bg-white text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {palette.colors.map((color: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {palette.paletteName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.location.href = "/paletas"}
              >
                Ver Todas as Paletas
              </Button>
            </Card>
          )}
          
          <Card className="p-6 shadow-xl">
            <h3 className="font-semibold mb-4 pb-2 text-slate-900 border-b border-slate-200">🎨 Fonte & Cor</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                variant={font === "Oswald" ? "default" : "outline"}
                onClick={() => setFont("Oswald")}
                className="font-oswald"
              >
                Oswald
              </Button>
              <Button
                variant={font === "Serif" ? "default" : "outline"}
                onClick={() => setFont("Serif")}
                className="font-serif"
              >
                Serif
              </Button>
              <Button
                variant={font === "Mono" ? "default" : "outline"}
                onClick={() => setFont("Mono")}
                className="font-mono"
              >
                Mono
              </Button>
              <Button
                variant={font === "Inter" ? "default" : "outline"}
                onClick={() => setFont("Inter")}
              >
                Inter
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-slate-900">Tamanho da fonte: {fontSize}%</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={50}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-slate-900">Cor do texto</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={textColor === "white" ? "default" : "outline"}
                    onClick={() => setTextColor("white")}
                  >
                    Branco
                  </Button>
                  <Button
                    variant={textColor === "black" ? "default" : "outline"}
                    onClick={() => setTextColor("black")}
                  >
                    Preto
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-slate-900">Alinhamento horizontal</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={alignHorizontal === "left" ? "default" : "outline"}
                    onClick={() => setAlignHorizontal("left")}
                    size="sm"
                  >
                    Esquerda
                  </Button>
                  <Button
                    variant={alignHorizontal === "center" ? "default" : "outline"}
                    onClick={() => setAlignHorizontal("center")}
                    size="sm"
                  >
                    Centro
                  </Button>
                  <Button
                    variant={alignHorizontal === "right" ? "default" : "outline"}
                    onClick={() => setAlignHorizontal("right")}
                    size="sm"
                  >
                    Direita
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-slate-900">Alinhamento vertical</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={alignVertical === "top" ? "default" : "outline"}
                    onClick={() => setAlignVertical("top")}
                    size="sm"
                  >
                    Topo
                  </Button>
                  <Button
                    variant={alignVertical === "middle" ? "default" : "outline"}
                    onClick={() => setAlignVertical("middle")}
                    size="sm"
                  >
                    Meio
                  </Button>
                  <Button
                    variant={alignVertical === "bottom" ? "default" : "outline"}
                    onClick={() => setAlignVertical("bottom")}
                    size="sm"
                  >
                    Fundo
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-slate-900">Esboço do texto</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={textOutline === 0 ? "default" : "outline"}
                    onClick={() => setTextOutline(0)}
                    size="sm"
                  >
                    Desligado
                  </Button>
                  <Button
                    variant={textOutline === 1 ? "default" : "outline"}
                    onClick={() => setTextOutline(1)}
                    size="sm"
                  >
                    Ligado
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 shadow-xl">
            <h3 className="font-semibold mb-4 pb-2 text-slate-900 border-b border-slate-200">✨ Efeitos de Imagem</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-900">Sobreposição: {fadeOverlay}%</Label>
                <Slider
                  value={[fadeOverlay]}
                  onValueChange={([value]) => setFadeOverlay(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-slate-900">Desfoque: {blur} px</Label>
                <Slider
                  value={[blur]}
                  onValueChange={([value]) => setBlur(value)}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-slate-900">Brilho: {brightness}%</Label>
                <Slider
                  value={[brightness]}
                  onValueChange={([value]) => setBrightness(value)}
                  min={0}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-slate-900">Contraste: {contrast}%</Label>
                <Slider
                  value={[contrast]}
                  onValueChange={([value]) => setContrast(value)}
                  min={0}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Dialog de Sugestões de Legendas */}
      <Dialog open={showCaptions} onOpenChange={setShowCaptions}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Sugestões de Legendas</DialogTitle>
            <DialogDescription>
              Legendas geradas por IA para o seu post. Clique para copiar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {captions.map((caption, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCopyCaption(caption, index)}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-slate-700 flex-1">{caption}</p>
                  {copiedIndex === index ? (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Salvar Template */}
      <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Salvar Template</DialogTitle>
            <DialogDescription>
              Salve suas configurações atuais como um template reutilizável.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-900">Nome do Template</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Promoção Semanal"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-slate-900">Descrição (opcional)</Label>
              <Input
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Ex: Template para promoções de produtos"
                className="mt-2"
              />
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSaveTemplate}
                disabled={saveTemplateMutation.isPending}
                className="flex-1"
              >
                {saveTemplateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSaveTemplate(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Preview de Remoção de Fundo */}
      <Dialog open={showRemoveBgPreview} onOpenChange={setShowRemoveBgPreview}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Remover Fundo</DialogTitle>
            <DialogDescription>
              Compare a imagem original com o fundo removido. Esta operação custa 1 crédito.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Original</h4>
              {originalImage && (
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto rounded-2xl border-2 border-slate-200"
                />
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Processada</h4>
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processada"
                  className="w-full h-auto rounded-2xl border-2 border-slate-200"
                />
              ) : (
                <div className="w-full h-64 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <p className="text-slate-500">Clique em "Processar" para remover o fundo</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            {!processedImage ? (
              <Button
                onClick={handleConfirmRemoveBackground}
                className="flex-1"
              >
                Processar (1 crédito)
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleApplyRemoveBackground}
                  className="flex-1"
                >
                  Aplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRemoveBgPreview(false);
                    setProcessedImage(null);
                    setOriginalImage(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Publicação no Instagram */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Instagram className="w-6 h-6 text-primary" />
              Publicar no Instagram
            </DialogTitle>
            <DialogDescription>
              Publique sua criação diretamente no Instagram conectado: @{instagramConnection?.instagramUsername}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview da imagem */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div className="w-32 h-32 border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <canvas
                    ref={(canvas) => {
                      if (canvas && canvasRef.current) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          canvas.width = 128;
                          canvas.height = 128;
                          ctx.drawImage(canvasRef.current, 0, 0, 128, 128);
                        }
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-center">
                  {width} x {height}px
                </p>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="instagram-caption">Legenda (opcional)</Label>
                <textarea
                id="instagram-caption"
                value={instagramCaption}
                onChange={(e) => setInstagramCaption(e.target.value)}
                placeholder="Escreva uma legenda para seu post..."
                className="w-full h-32 p-3 border border-slate-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={2200}
              />
                <p className="text-xs text-slate-500 mt-1">
                  {instagramCaption.length}/2200 caracteres
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-sm text-slate-700">
                <strong>Dica:</strong> Use emojis e hashtags relevantes para aumentar o engajamento!
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (lastCreationId) {
                    publishMutation.mutate({
                      creationId: lastCreationId,
                      caption: instagramCaption || undefined,
                    });
                  }
                }}
                disabled={publishMutation.isPending || !lastCreationId}
                className="flex-1"
              >
                {publishMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Instagram className="w-4 h-4 mr-2" />
                    Publicar Agora
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPublishDialog(false)}
                disabled={publishMutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Variações com IA */}
      <Dialog open={showVariations} onOpenChange={setShowVariations}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              10 Variações Geradas com IA
            </DialogTitle>
            <DialogDescription>
              Selecione as variações que deseja salvar como novas criações. Cada variação tem cores, fontes e layouts diferentes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {variations.map((variation) => (
              <div
                key={variation.id}
                className={`relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selectedVariations.has(variation.id)
                    ? "border-purple-500 shadow-lg scale-105"
                    : "border-slate-200 hover:border-purple-300"
                }`}
                onClick={() => {
                  const newSelected = new Set(selectedVariations);
                  if (newSelected.has(variation.id)) {
                    newSelected.delete(variation.id);
                  } else {
                    newSelected.add(variation.id);
                  }
                  setSelectedVariations(newSelected);
                }}
              >
                {/* Checkbox de seleção */}
                <div className="absolute top-2 right-2 z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedVariations.has(variation.id)
                        ? "bg-purple-500 text-white"
                        : "bg-white border-2 border-slate-300"
                    }`}
                  >
                    {selectedVariations.has(variation.id) && <Check className="w-4 h-4" />}
                  </div>
                </div>
                
                {/* Preview da variação */}
                <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Variação #{variation.id}
                    </p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p><strong>Modelo:</strong> {variation.model}</p>
                      <p><strong>Fonte:</strong> {variation.font}</p>
                      <p><strong>Alinhamento:</strong> {variation.alignHorizontal}</p>
                      <p><strong>Paleta:</strong> {variation.palette.name}</p>
                    </div>
                    <div className="flex gap-1 mt-2 justify-center">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300"
                        style={{ backgroundColor: variation.palette.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300"
                        style={{ backgroundColor: variation.palette.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300"
                        style={{ backgroundColor: variation.palette.colors.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button
              onClick={async () => {
                if (selectedVariations.size === 0) {
                  toast.error("Selecione pelo menos uma variação");
                  return;
                }
                
                // Salvar variações selecionadas
                for (const varId of Array.from(selectedVariations)) {
                  const variation = variations.find(v => v.id === varId);
                  if (variation) {
                    await createMutation.mutateAsync({
                      text: variation.text,
                      format: variation.format,
                      model: variation.model,
                      font: variation.font,
                      fontSize: variation.fontSize,
                      textColor: variation.textColor,
                      textOutline: variation.textOutline,
                      alignHorizontal: variation.alignHorizontal,
                      alignVertical: variation.alignVertical,
                      fadeOverlay: variation.fadeOverlay,
                      blur: variation.blur,
                      brightness: variation.brightness,
                      contrast: variation.contrast,
                      backgroundImageUrl: variation.backgroundImageUrl,
                      backgroundImageKey: variation.backgroundImageKey,
                    });
                  }
                }
                
                toast.success(`${selectedVariations.size} variações salvas com sucesso!`);
                setShowVariations(false);
                setSelectedVariations(new Set());
              }}
              disabled={selectedVariations.size === 0 || createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Salvar {selectedVariations.size} Variações
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowVariations(false);
                setSelectedVariations(new Set());
              }}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Geração em Massa via CSV */}
      <Dialog open={showCSVModal} onOpenChange={setShowCSVModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Geração em Massa via CSV</DialogTitle>
            <DialogDescription>
              Crie múltiplos posts de uma vez importando um arquivo CSV
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Upload CSV */}
            <div>
              <Label>Arquivo CSV</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCSVFile(file);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target?.result as string;
                      const lines = text.split("\n").filter(l => l.trim());
                      const headers = lines[0].split(",").map(h => h.trim());
                      const data = lines.slice(1).map(line => {
                        const values = line.split(",").map(v => v.trim());
                        const obj: any = {};
                        headers.forEach((header, i) => {
                          obj[header] = values[i] || "";
                        });
                        return obj;
                      });
                      setCSVData(data);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formato: texto, formato (opcional), modelo (opcional), fonte (opcional)
              </p>
            </div>

            {/* Botão de Download Template */}
            <Button
              variant="outline"
              onClick={() => {
                const csv = "text,format,model,font\nSeu texto aqui,portrait,classic,Oswald\nOutro texto,square,bold,Inter\nMais um texto,story,fade,Serif";
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "template.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template CSV
            </Button>

            {/* Preview */}
            {csvData.length > 0 && (
              <div>
                <Label>Preview ({csvData.length} posts)</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {csvData.slice(0, 10).map((row, i) => (
                    <div key={i} className="text-sm p-2 bg-muted rounded">
                      <p className="font-medium">{row.text || row.texto}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.format || row.formato || "portrait"} | {row.model || row.modelo || "classic"} | {row.font || row.fonte || "Oswald"}
                      </p>
                    </div>
                  ))}
                  {csvData.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{csvData.length - 10} posts...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Barra de progresso */}
            {bulkGenerateMutation.isPending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Criando posts...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (csvData.length === 0) {
                    toast.error("Nenhum dado para processar");
                    return;
                  }
                  const formatted = csvData.map(row => ({
                    text: row.text || row.texto,
                    format: row.format || row.formato,
                    model: row.model || row.modelo,
                    font: row.font || row.fonte,
                  }));
                  bulkGenerateMutation.mutate({ csvData: formatted });
                }}
                disabled={csvData.length === 0 || bulkGenerateMutation.isPending}
                className="flex-1"
              >
                {bulkGenerateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Criar {csvData.length} Posts
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCSVModal(false);
                  setCSVData([]);
                  setCSVFile(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Hashtags */}
      <Dialog open={showHashtagsModal} onOpenChange={setShowHashtagsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📱 30 Hashtags Sugeridas pela LucresIA</DialogTitle>
            <DialogDescription>
              Hashtags categorizadas para maximizar seu alcance no Instagram
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {hashtags && (
              <>
                {/* Hashtags de Alcance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Alcance (Alto Volume)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.reach.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          setCopiedHashtag(tag);
                          toast.success(`Copiado: ${tag}`);
                          setTimeout(() => setCopiedHashtag(null), 2000);
                        }}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        {tag}
                        {copiedHashtag === tag && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const text = hashtags.reach.join(" ");
                      navigator.clipboard.writeText(text);
                      toast.success("Todas as hashtags de alcance copiadas!");
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Todas
                  </Button>
                </div>

                {/* Hashtags de Nicho */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Nicho (Específicas)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.niche.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          setCopiedHashtag(tag);
                          toast.success(`Copiado: ${tag}`);
                          setTimeout(() => setCopiedHashtag(null), 2000);
                        }}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                      >
                        {tag}
                        {copiedHashtag === tag && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const text = hashtags.niche.join(" ");
                      navigator.clipboard.writeText(text);
                      toast.success("Todas as hashtags de nicho copiadas!");
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Todas
                  </Button>
                </div>

                {/* Hashtags Trending */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    Trending (Tendências)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.trending.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          setCopiedHashtag(tag);
                          toast.success(`Copiado: ${tag}`);
                          setTimeout(() => setCopiedHashtag(null), 2000);
                        }}
                        className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors flex items-center gap-1"
                      >
                        {tag}
                        {copiedHashtag === tag && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const text = hashtags.trending.join(" ");
                      navigator.clipboard.writeText(text);
                      toast.success("Todas as hashtags trending copiadas!");
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar Todas
                  </Button>
                </div>

                {/* Copiar Tudo */}
                <div className="pt-4 border-t">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    onClick={() => {
                      const allHashtags = [
                        ...hashtags.reach,
                        ...hashtags.niche,
                        ...hashtags.trending,
                      ].join(" ");
                      navigator.clipboard.writeText(allHashtags);
                      toast.success("🎉 Todas as 30 hashtags copiadas!");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Todas as 30 Hashtags
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Otimizar Texto */}
      <Dialog open={showOptimizeModal} onOpenChange={setShowOptimizeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💜 LucresIA: Texto Otimizado</DialogTitle>
            <DialogDescription>
              Comparação entre o texto original e a versão otimizada pela LucresIA
            </DialogDescription>
          </DialogHeader>
          {optimizedText && (
            <div className="space-y-6 mt-4">
              {/* Comparação lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <h3 className="text-lg font-semibold">Original</h3>
                  </div>
                  <div className="p-4 bg-muted rounded-2xl border-2 border-gray-300 min-h-[200px]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{optimizedText.original}</p>
                  </div>
                </div>
                
                {/* Otimizado */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-lg font-semibold text-green-600">Otimizado</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-300 min-h-[200px]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{optimizedText.optimized}</p>
                  </div>
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setText(optimizedText.optimized);
                    toast.success("Texto otimizado aplicado!");
                    setShowOptimizeModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Usar Texto Otimizado
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(optimizedText.optimized);
                    toast.success("Texto copiado!");
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Prever Engajamento */}
      <Dialog open={showEngagementModal} onOpenChange={setShowEngagementModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💜 LucresIA: Previsão de Engajamento</DialogTitle>
            <DialogDescription>
              Análise preditiva do potencial de engajamento do seu post
            </DialogDescription>
          </DialogHeader>
          {engagementPrediction && (
            <div className="space-y-6 mt-4">
              {/* Score principal */}
              <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-200">
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {engagementPrediction.score}
                </div>
                <div className="text-lg text-gray-600 mt-2">Score de Engajamento</div>
                <div className="text-sm text-gray-500 mt-1">0 = Baixo | 100 = Excelente</div>
              </div>
              
              {/* Breakdown por fatores */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Breakdown por Fatores</h3>
                {Object.entries(engagementPrediction.factors).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    text: "Texto",
                    visual: "Visual",
                    hashtags: "Hashtags",
                    cta: "CTA",
                    timing: "Timing"
                  };
                  const score = value as number;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{labels[key]}</span>
                        <span className="text-gray-600">{score}/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Sugestões */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sugestões de Melhoria</h3>
                <ul className="space-y-2">
                  {engagementPrediction.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-3 bg-muted rounded-xl">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span className="text-sm flex-1">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Variações de Legenda */}
      <Dialog open={showCaptionVariationsModal} onOpenChange={setShowCaptionVariationsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💜 LucresIA: Variações de Legenda</DialogTitle>
            <DialogDescription>
              {captionVariations.length} variações geradas pela LucresIA com diferentes tons
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {captionVariations.map((variation, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-2xl border-2 border-transparent hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {variation.tone}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {variation.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(variation.variation);
                        toast.success("Legenda copiada!");
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setText(variation.variation);
                        toast.success("Legenda aplicada!");
                        setShowCaptionVariationsModal(false);
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                      Usar Esta
                    </Button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{variation.variation}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Sugestão de Emojis */}
      <Dialog open={showEmojiModal} onOpenChange={setShowEmojiModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💜 LucresIA: Emojis Sugeridos</DialogTitle>
            <DialogDescription>
              {emojiSuggestions.length} emojis contextuais selecionados pela LucresIA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Grid de emojis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emojiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0">{suggestion.emoji}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          {suggestion.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{suggestion.reason}</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          // Adicionar emoji ao final do texto
                          setText(text + " " + suggestion.emoji);
                          toast.success(`Emoji ${suggestion.emoji} adicionado!`);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        Adicionar ao Texto
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão aplicar todos */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const allEmojis = emojiSuggestions.map(s => s.emoji).join(" ");
                  setText(text + " " + allEmojis);
                  toast.success(`${emojiSuggestions.length} emojis adicionados!`);
                  setShowEmojiModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Adicionar Todos os Emojis
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const allEmojis = emojiSuggestions.map(s => s.emoji).join(" ");
                  navigator.clipboard.writeText(allEmojis);
                  toast.success("Emojis copiados!");
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Todos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
