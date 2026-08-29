package com.example.ui.screens.scan

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.Uri
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.FlipCameraAndroid
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.example.R
import com.example.data.local.DemoKnowledgeBase
import com.example.data.model.Equipment
import com.example.data.repository.FieldRepository
import com.example.data.repository.SettingsRepository
import com.example.ui.components.FieldMindTopBar
import com.example.ui.components.LargePrimaryFieldButton
import com.example.ui.components.LargeSecondaryFieldButton
import com.example.ui.theme.CleanBgLight
import com.example.ui.theme.CleanBorder
import com.example.ui.theme.CleanBrandContainer
import com.example.ui.theme.CleanBrandPrimary
import com.example.ui.theme.CleanSurfaceAlt
import com.example.ui.theme.CleanSurfaceLight
import com.example.ui.theme.CleanTextMuted
import com.example.ui.theme.CleanTextPrimary
import com.example.ui.theme.CleanTextSecondary
import com.example.ui.theme.PastelBlueBg
import com.example.ui.theme.PastelBlueIcon
import com.example.ui.theme.SafetyAmber
import com.example.ui.theme.SafetyGreen
import java.io.File
import java.util.concurrent.Executors

@Composable
fun ScanScreen(
    fieldRepository: FieldRepository,
    settingsRepository: SettingsRepository,
    onNavigateBack: () -> Unit,
    onContinueToDiagnosis: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val isOfflineMode by settingsRepository.isOfflineDemoMode.collectAsStateWithLifecycle()

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    var permissionRequested by remember { mutableStateOf(false) }
    var capturedImageUri by remember { mutableStateOf<Uri?>(null) }
    var isCapturing by remember { mutableStateOf(false) }
    var selectedDemoEquipment by remember {
        mutableStateOf(DemoKnowledgeBase.demoEquipments.first())
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasCameraPermission = isGranted
        permissionRequested = true
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission && !permissionRequested) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    val imageCapture = remember { ImageCapture.Builder().build() }
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }

    Scaffold(
        topBar = {
            FieldMindTopBar(
                title = "Equipment Scanner",
                subtitle = "Optical & Neural Model ID",
                onBackClick = onNavigateBack,
                isOfflineMode = isOfflineMode
            )
        },
        containerColor = CleanBgLight
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Main Viewfinder / Captured Preview Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color(0xFF0F172A))
                    .border(1.5.dp, if (capturedImageUri != null) SafetyGreen else CleanBrandPrimary, RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                if (capturedImageUri != null) {
                    // Captured Image Preview Screen
                    AsyncImage(
                        model = capturedImageUri,
                        contentDescription = "Captured Equipment Photo",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )

                    // Scrim overlay with detection result badge
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Black.copy(alpha = 0.3f),
                                        Color.Transparent,
                                        Color.Black.copy(alpha = 0.8f)
                                    )
                                )
                            )
                    )

                    // Capture HUD overlay
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(18.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFDCFCE7))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = Color(0xFF166534),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "IMAGE CAPTURED & IDENTIFIED",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color(0xFF166534),
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp,
                                    fontSize = 10.sp
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = selectedDemoEquipment.name,
                            style = MaterialTheme.typography.titleLarge.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                        )
                        Text(
                            text = "${selectedDemoEquipment.model} • S/N: ${selectedDemoEquipment.serialNumber}",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Color.White.copy(alpha = 0.85f),
                                fontSize = 12.sp
                            )
                        )
                    }
                } else if (hasCameraPermission) {
                    // Live CameraX Preview
                    AndroidView(
                        factory = { ctx ->
                            val previewView = PreviewView(ctx).apply {
                                layoutParams = ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                                )
                            }
                            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                            cameraProviderFuture.addListener({
                                try {
                                    val cameraProvider = cameraProviderFuture.get()
                                    val preview = Preview.Builder().build().also {
                                        it.setSurfaceProvider(previewView.surfaceProvider)
                                    }
                                    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                                    cameraProvider.unbindAll()
                                    cameraProvider.bindToLifecycle(
                                        lifecycleOwner,
                                        cameraSelector,
                                        preview,
                                        imageCapture
                                    )
                                } catch (e: Exception) {
                                    e.printStackTrace()
                                }
                            }, ContextCompat.getMainExecutor(ctx))
                            previewView
                        },
                        modifier = Modifier.fillMaxSize()
                    )

                    // Target Reticle Overlay
                    Box(
                        modifier = Modifier
                            .size(240.dp)
                            .border(2.dp, Color.White.copy(alpha = 0.8f), RoundedCornerShape(16.dp))
                    )

                    // Reticle Corner Accents
                    Box(
                        modifier = Modifier
                            .size(240.dp)
                            .padding(8.dp)
                    ) {
                        Text(
                            text = "ALIGN EQUIPMENT IN FRAME",
                            color = Color.White.copy(alpha = 0.9f),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                fontSize = 10.sp
                            ),
                            modifier = Modifier
                                .align(Alignment.TopCenter)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.Black.copy(alpha = 0.5f))
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                } else {
                    // Fallback when camera permission not granted or unavailable
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(PastelBlueBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.CameraAlt,
                                contentDescription = null,
                                tint = PastelBlueIcon,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "Camera Sensor Standby",
                            style = MaterialTheme.typography.titleMedium.copy(
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Tap capture below to run simulation with pre-loaded optical signatures.",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Color.White.copy(alpha = 0.7f),
                                textAlign = TextAlign.Center,
                                fontSize = 12.sp
                            )
                        )
                    }
                }

                if (isCapturing) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.6f)),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = CleanBrandPrimary,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Demo Equipment Preset Selector Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, CleanBorder, RoundedCornerShape(20.dp)),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CleanSurfaceLight),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "SELECT EQUIPMENT PROFILE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanTextSecondary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.6.sp,
                                fontSize = 11.sp
                            )
                        )
                        Text(
                            text = "Hackathon Presets",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = CleanTextMuted,
                                fontSize = 11.sp
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(DemoKnowledgeBase.demoEquipments) { equipment ->
                            val isSelected = selectedDemoEquipment.id == equipment.id
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(
                                        if (isSelected) CleanBrandContainer else CleanSurfaceAlt
                                    )
                                    .border(
                                        1.dp,
                                        if (isSelected) CleanBrandPrimary else CleanBorder,
                                        RoundedCornerShape(14.dp)
                                    )
                                    .clickable {
                                        selectedDemoEquipment = equipment
                                        fieldRepository.selectEquipment(equipment)
                                    }
                                    .padding(horizontal = 14.dp, vertical = 8.dp)
                                    .testTag("equipment_preset_${equipment.id}")
                            ) {
                                Text(
                                    text = equipment.name,
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = if (isSelected) CleanBrandPrimary else CleanTextPrimary,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        fontSize = 12.sp
                                    )
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Action Buttons based on state
            if (capturedImageUri == null) {
                // Initial State: Capture Button
                LargePrimaryFieldButton(
                    text = "Capture Inspection Photo",
                    icon = Icons.Default.PhotoCamera,
                    onClick = {
                        isCapturing = true
                        if (hasCameraPermission) {
                            try {
                                val photoFile = File(
                                    context.cacheDir,
                                    "fieldmind_scan_${System.currentTimeMillis()}.jpg"
                                )
                                val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()
                                imageCapture.takePicture(
                                    outputOptions,
                                    cameraExecutor,
                                    object : ImageCapture.OnImageSavedCallback {
                                        override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                                            ContextCompat.getMainExecutor(context).execute {
                                                isCapturing = false
                                                val uri = Uri.fromFile(photoFile)
                                                capturedImageUri = uri
                                                fieldRepository.setCapturedImageUri(uri.toString())
                                                fieldRepository.selectEquipment(selectedDemoEquipment)
                                            }
                                        }

                                        override fun onError(exception: ImageCaptureException) {
                                            ContextCompat.getMainExecutor(context).execute {
                                                isCapturing = false
                                                val dummyUri = Uri.parse("android.resource://${context.packageName}/${R.drawable.img_hero_technician}")
                                                capturedImageUri = dummyUri
                                                fieldRepository.setCapturedImageUri(dummyUri.toString())
                                                fieldRepository.selectEquipment(selectedDemoEquipment)
                                            }
                                        }
                                    }
                                )
                            } catch (e: Exception) {
                                isCapturing = false
                                val dummyUri = Uri.parse("android.resource://${context.packageName}/${R.drawable.img_hero_technician}")
                                capturedImageUri = dummyUri
                                fieldRepository.setCapturedImageUri(dummyUri.toString())
                                fieldRepository.selectEquipment(selectedDemoEquipment)
                            }
                        } else {
                            isCapturing = false
                            val dummyUri = Uri.parse("android.resource://${context.packageName}/${R.drawable.img_hero_technician}")
                            capturedImageUri = dummyUri
                            fieldRepository.setCapturedImageUri(dummyUri.toString())
                            fieldRepository.selectEquipment(selectedDemoEquipment)
                        }
                    },
                    testTag = "capture_photo_button"
                )
            } else {
                // After Capture: Retake and Continue to Diagnosis buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    LargeSecondaryFieldButton(
                        text = "Retake",
                        icon = Icons.Default.Refresh,
                        onClick = {
                            capturedImageUri = null
                            fieldRepository.setCapturedImageUri(null)
                        },
                        modifier = Modifier.weight(0.4f),
                        testTag = "retake_photo_button"
                    )

                    LargePrimaryFieldButton(
                        text = "Continue to Diagnosis",
                        icon = Icons.Default.CheckCircle,
                        onClick = {
                            fieldRepository.selectEquipment(selectedDemoEquipment)
                            onContinueToDiagnosis()
                        },
                        modifier = Modifier.weight(0.6f),
                        containerColor = CleanBrandPrimary,
                        testTag = "continue_to_diagnosis_button"
                    )
                }
            }
        }
    }
}
